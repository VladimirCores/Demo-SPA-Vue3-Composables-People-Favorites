<script setup lang="ts">
import { computed } from 'vue';

import { usePeople } from '~/composables';

const { list: people, loading } = usePeople();
const isLoadingInitial = computed(() => loading.progress.final < 0);
const getLoadingText = computed(() => `Loading (${loading.progress.current}/${isLoadingInitial.value ? '?' : loading.progress.final})`);
</script>

<template>
  <div v-if="loading.isProgress" class="w-56">
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
  <div v-else>
    {{ people }}
  </div>
</template>
