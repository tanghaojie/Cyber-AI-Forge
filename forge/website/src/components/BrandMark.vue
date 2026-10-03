<template>
  <svg class="brand-mark" viewBox="0 0 112 96" aria-hidden="true">
    <path class="brand-mark__outer" d="M88 30 74 16H36L16 36v24l20 20h38l14-14" />
    <path class="brand-mark__inner" d="M75 37 68 30H43L30 43v10l13 13h25l7-7" />
    <path class="brand-mark__accent" d="m79 21 9 9m-9 45 9-9" />
    <rect x="92" y="43" width="10" height="10" rx="1.5" />
  </svg>
</template>
<style scoped>
.brand-mark {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}
.brand-mark path {
  fill: none;
  stroke: var(--prism-text);
  stroke-linecap: square;
  stroke-linejoin: bevel;
}
.brand-mark__outer {
  stroke-width: 12;
}
.brand-mark__inner {
  stroke-width: 5;
}
.brand-mark path.brand-mark__accent {
  stroke: var(--prism-accent);
  stroke-width: 12;
}
.brand-mark rect {
  fill: var(--prism-accent);
}
</style>
