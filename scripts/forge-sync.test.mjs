import assert from 'node:assert/strict'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { classifyPath, parseManifest } from './forge-sync.mjs'

const syncScript = fileURLToPath(new URL('./forge-sync.mjs', import.meta.url))

test('parses the repository YAML manifest', async () => {
  const manifestPath = fileURLToPath(new URL('../.forge-sync.yml', import.meta.url))
  const manifest = parseManifest(await readFile(manifestPath, 'utf8'))
  assert.ok(manifest.foundation.includes('docs/templates/'))
  assert.equal(classifyPath('packages/design-tokens/package.json', manifest), 'foundation')
  assert.equal(
    classifyPath('packages/design-tokens/src/foundation/modules/theme/theme.tokens.css', manifest),
    'foundation',
  )
  assert.equal(
    classifyPath('apps/frontend/src/platform/assets/prism-structure.png', manifest),
    'platform',
  )
  assert.equal(
    classifyPath('forge/website/src/assets/design-previews/users.png', manifest),
    'forge',
  )
  assert.ok(manifest.platform.includes('.archive-audit.json'))
  assert.ok(manifest.platform.includes('README.md'))
  assert.ok(manifest.forge.includes('forge/'))
  assert.ok(manifest.integration.includes('scripts/git/'))
  assert.ok(manifest.integration.includes('.github/workflows/verify-commit-convention.yml'))
  assert.equal(classifyPath('scripts/git/commit-message.mjs', manifest), 'integration')
  assert.equal(
    classifyPath('.github/workflows/verify-commit-convention.yml', manifest),
    'integration',
  )
})

function run(command, args, directory, allowFailure = false) {
  const result = spawnSync(command, args, { cwd: directory, encoding: 'utf8' })
  if (!allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`)
  }
  return result
}

async function write(path, content) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content)
}

async function repository(validate = []) {
  const directory = await mkdtemp(join(tmpdir(), 'forge-sync-'))
  await mkdir(join(directory, 'scripts'), { recursive: true })
  await copyFile(syncScript, join(directory, 'scripts/forge-sync.mjs'))
  await writeFile(
    join(directory, '.forge-sync.yml'),
    JSON.stringify({
      foundation: ['foundation/'],
      platform: ['platform/', '.archive-audit.json', 'README.md'],
      forge: ['forge/'],
      integration: ['.forge-sync.yml', 'scripts/forge-sync.mjs'],
      validate,
    }),
  )
  await write(join(directory, 'foundation/value.txt'), 'foundation-v1')
  await write(join(directory, 'platform/value.txt'), 'platform-default-v1')
  await write(join(directory, '.archive-audit.json'), '{"repositoryRole":"forge-upstream"}')
  await write(join(directory, 'forge/value.txt'), 'forge-v1')
  await write(join(directory, 'README.md'), 'forge-readme-v1')
  run('git', ['init', '-b', 'master'], directory)
  run('git', ['config', 'user.email', 'test@example.com'], directory)
  run('git', ['config', 'user.name', 'Forge Sync Test'], directory)
  run('git', ['add', '.'], directory)
  run('git', ['commit', '-m', 'base'], directory)

  run('git', ['switch', '-c', 'downstream'], directory)
  await write(join(directory, 'platform/value.txt'), 'platform-downstream')
  await write(join(directory, '.archive-audit.json'), '{"repositoryRole":"platform-downstream"}')
  await write(join(directory, 'README.md'), 'downstream-readme')
  run('git', ['rm', '-r', 'forge'], directory)
  run('git', ['add', '.'], directory)
  run('git', ['commit', '-m', 'downstream ownership'], directory)

  run('git', ['switch', 'master'], directory)
  run('git', ['switch', '-c', 'upstream'], directory)
  await write(join(directory, 'foundation/value.txt'), 'foundation-v2')
  await write(join(directory, 'platform/value.txt'), 'platform-default-v2')
  await write(join(directory, '.archive-audit.json'), '{"repositoryRole":"forge-upstream-v2"}')
  await write(join(directory, 'forge/value.txt'), 'forge-v2')
  await write(join(directory, 'README.md'), 'forge-readme-v2')
  run('git', ['add', '.'], directory)
  run('git', ['commit', '-m', 'upstream update'], directory)
  run('git', ['switch', 'downstream'], directory)
  return directory
}

test('preserves Platform and README while accepting Foundation and excluding Forge', async () => {
  const directory = await repository()
  try {
    const result = run(
      process.execPath,
      ['scripts/forge-sync.mjs', '--upstream-ref', 'upstream'],
      directory,
    )
    assert.equal(result.status, 0)
    assert.equal(await readFile(join(directory, 'foundation/value.txt'), 'utf8'), 'foundation-v2')
    assert.equal(
      await readFile(join(directory, 'platform/value.txt'), 'utf8'),
      'platform-downstream',
    )
    assert.equal(await readFile(join(directory, 'README.md'), 'utf8'), 'downstream-readme')
    assert.equal(
      await readFile(join(directory, '.archive-audit.json'), 'utf8'),
      '{"repositoryRole":"platform-downstream"}',
    )
    assert.notEqual(
      run('git', ['cat-file', '-e', 'HEAD:forge/value.txt'], directory, true).status,
      0,
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('rejects unknown upstream paths before starting a merge', async () => {
  const directory = await repository()
  try {
    run('git', ['switch', 'upstream'], directory)
    await write(join(directory, 'unknown/value.txt'), 'unknown')
    run('git', ['add', '.'], directory)
    run('git', ['commit', '-m', 'unknown path'], directory)
    run('git', ['switch', 'downstream'], directory)
    const result = run(
      process.execPath,
      ['scripts/forge-sync.mjs', '--upstream-ref', 'upstream'],
      directory,
      true,
    )
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /Unknown paths/)
    assert.notEqual(
      run('git', ['rev-parse', '-q', '--verify', 'MERGE_HEAD'], directory, true).status,
      0,
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('leaves the no-commit merge open when validation fails', async () => {
  const directory = await repository(['node -e "process.exit(7)"'])
  try {
    const result = run(
      process.execPath,
      ['scripts/forge-sync.mjs', '--upstream-ref', 'upstream'],
      directory,
      true,
    )
    assert.notEqual(result.status, 0)
    assert.equal(run('git', ['rev-parse', '-q', '--verify', 'MERGE_HEAD'], directory).status, 0)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
