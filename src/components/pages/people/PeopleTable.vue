<script setup lang="ts">
import { IPerson } from '~/interfaces';

defineProps<{
  people: IPerson[]
}>();

const emit = defineEmits<{
  (e: 'favorite', id: number): void
}>();

const onFavorite = (event:Event) => {
  const domInputElement = event!.currentTarget as HTMLInputElement;
  const index = parseInt(domInputElement.dataset.index!);
  console.log('> PeopleTable -> onFavorite:', index);
  emit('favorite', index);
};
</script>

<template>
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
      <tr v-for="(item, index) in people" :key="item.name">
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
</template>
