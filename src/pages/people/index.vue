<script setup lang="ts">
import { computed } from 'vue';

import { usePeople } from '~/composables';

const { list: people, loading, switchFavorite } = usePeople();
const isLoadingInitial = computed(() => loading.progress.final < 0);
const getLoadingText = computed(() => `Loading (${loading.progress.current}/${isLoadingInitial.value ? '?' : loading.progress.final})`);

const onFavorite = (event:Event) => {
  const index = parseInt((event!.currentTarget as HTMLInputElement).dataset.index);
  console.log('> PeoplePage -> onFavorite:', index);
  switchFavorite(index);
};
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
  <div v-else class="overflow-x-auto">
    <table class="table table-sm table-pin-rows">
      <thead>
        <tr>
          <th>№</th>
          <th>Name</th>
          <th>Height</th>
          <th>Mass</th>
          <th>Hair Color</th>
          <th>Favorite</th>
        </tr>
      </thead>
      <tbody class="text-neutral">
        <tr v-for="(item, index) in people" :key="index">
          <th>{{ index + 1 }}</th>
          <th>{{ item.name }}</th>
          <th>{{ item.height }}</th>
          <th>{{ item.mass }}</th>
          <th>{{ item.hair_color }}</th>
          <th>
            <label>
              <input
                :data-index="index"
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="item.favorite"
                @change="onFavorite"
              >
            </label>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
