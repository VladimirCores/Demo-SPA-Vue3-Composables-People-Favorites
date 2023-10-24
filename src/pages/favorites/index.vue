<script setup lang="ts">
import { useFavorites, usePeople } from '~/composables';

import PeopleTable from '~/components/pages/people/PeopleTable.vue';

const { list: favoriteList, switchFavorite } = useFavorites();
const { list: peopleList } = usePeople();
const onFavorite = (index:number) => {
  const favoritePerson = favoriteList.value[index];
  const person = peopleList.value ? peopleList.value[favoritePerson.position!] : null;
  console.log('> FavoritePage -> onFavorite:', index, favoritePerson);
  switchFavorite(person || favoritePerson);
};
</script>

<template>
  <div v-if="favoriteList.length === 0">
    <span class="text-xl font-bold">Nothing in favorites</span>
  </div>
  <PeopleTable v-else :people="favoriteList" @favorite="onFavorite" />
</template>
