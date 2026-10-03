<template>
  <div class="platform-artwork" aria-hidden="true">
    <img v-if="brand.artwork" :src="brand.artwork" alt="" draggable="false" />
    <div v-else class="platform-artwork__structure"><i /><i /><i /></div>
  </div>
</template>
<script setup lang="ts">
import { usePlatformDefinition } from '@/foundation/platform/platform'
const { brand } = usePlatformDefinition()
</script>
<style scoped>
.platform-artwork {
  overflow: hidden;
  background: #0b0d10;
}
.platform-artwork img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.platform-artwork__structure {
  height: 100%;
  min-height: 260px;
  display: grid;
  place-items: center;
  perspective: 800px;
}
.platform-artwork__structure i {
  position: absolute;
  width: 48%;
  aspect-ratio: 1;
  border: 18px solid #3c4249;
  box-shadow: inset 2px 2px #a5adb8;
  transform: rotateX(28deg) rotateY(-35deg) rotateZ(-12deg);
}
.platform-artwork__structure i:nth-child(2) {
  translate: 25px -25px;
  border-color: #30343b;
}
.platform-artwork__structure i:nth-child(3) {
  translate: 50px -50px;
  border-color: #252a31;
}
</style>
