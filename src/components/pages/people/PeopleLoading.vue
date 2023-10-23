<script setup lang="ts">
import { computed } from 'vue';

import { IPeopleLoading } from '~/interfaces';

const props = defineProps<{
  loading: IPeopleLoading
}>();

const isLoadingInitial = computed(() => props.loading.progress.final < 0);
const getLoadingText = computed(() => `Loading (${props.loading.progress.current}/${isLoadingInitial.value ? '?' : props.loading.progress.final})`);
</script>

<template>
  <div class="w-72">
    <progress v-if="isLoadingInitial" class="progress" />
    <progress
      v-else
      :value="loading.progress.current"
      :max="loading.progress.final"
      class="progress"
    />
    <div class="flex flex-row items-center space-x-2">
      <span class="loading loading-spinner loading-xs text-accent" />
      <span class="text-sm">
        {{ getLoadingText }}
      </span>
    </div>
  </div>
</template>
