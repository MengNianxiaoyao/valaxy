<script lang="ts" setup>
import type { Feature } from '../types'
import { computed } from 'vue'

const props = defineProps<{
  features: Feature[]
}>()

const grid = computed(() => {
  const length = props.features.length
  if (length <= 3)
    return `grid-cols-1 sm:grid-cols-2 md:grid-cols-${length}`
  else
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
})
</script>

<template>
  <div class="press-features">
    <div class="m-auto grid gap-4 max-w-$pr-layout-max-width" p="x-6" :class="[grid]">
      <div v-for="feature in features" :key="feature.title" class="inline-grid">
        <PressFeature :feature="feature" />
      </div>
    </div>
  </div>
</template>
