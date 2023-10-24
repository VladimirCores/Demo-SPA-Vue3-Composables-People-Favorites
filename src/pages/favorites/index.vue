<script setup lang="ts">
import { useFavorites } from '~/composables';

import PeopleTable from '~/components/pages/people/PeopleTable.vue';

const { list, switchFavorite } = useFavorites();
const onFavorite = (index:number) => {
  const person = list.value[index];
  console.log('> FavoritePage -> onFavorite:', index, person);
  switchFavorite(person.position!);
};
</script>

<template>
  <PeopleTable :people="list" @favorite="onFavorite" />
</template>
