import { access, readFile, readdir } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { cwd } from 'node:process'

const root = cwd()
const requiredDirectories = [
  'apps/frontend/src/foundation',
  'apps/frontend/src/platform',
  'apps/backend/src/foundation',
  'apps/backend/src/platform',
  'packages/api-contract/src/foundation',
  'packages/api-contract/src/platform',
]
const forbiddenDirectories = [
  'apps/frontend/src/modules/system',
  'apps/frontend/src/modules/biz',
  'apps/backend/src/modules/system',
  'apps/backend/src/modules/biz',
  'packages/api-contract/src/modules',
]
const foundationRoots = [
  'packages/design-tokens/src/foundation',
  'apps/frontend/src/foundation',
  'apps/backend/src/foundation',
  'packages/api-contract/src/foundation',
]
const sourceExtensions = new Set(['.ts', '.mts', '.tsx', '.vue', '.js', '.mjs'])
const failures = []

async function exists(path) {
  try {
    await access(join(root, path))
    return true
  } catch {
    return false
  }
}

async function sourceFiles(path) {
  const files = []
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const entryPath = join(path, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await sourceFiles(entryPath)))
    } else if (sourceExtensions.has(extname(entry.name))) {
      files.push(entryPath)
    }
  }
  return files
}

for (const directory of requiredDirectories) {
  if (!(await exists(directory))) {
    failures.push(`missing required ownership root: ${directory}`)
  }
}
for (const directory of forbiddenDirectories) {
  if (await exists(directory)) {
    failures.push(`legacy ownership directory remains: ${directory}`)
  }
}
for (const directory of foundationRoots) {
  if (!(await exists(directory))) {
    continue
  }
  for (const file of await sourceFiles(join(root, directory))) {
    const content = await readFile(file, 'utf8')
    if (
      /from\s+['"](?:@\/platform\/|(?:\.\.\/)+platform\/)|import\s*\([^)]*['"](?:@\/platform\/|(?:\.\.\/)+platform\/)/.test(
        content,
      )
    ) {
      failures.push(`Foundation imports Platform: ${relative(root, file)}`)
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Ownership structure check passed')
}
