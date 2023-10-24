<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useFavorites, usePeople, useSearch } from '~/composables';

import MessageError from '~/components/message/MessageError.vue';
import PeopleLoading from '~/components/pages/people/PeopleLoading.vue';
import PeopleSearch from '~/components/pages/people/PeopleSearch.vue';
import PeopleTable from '~/components/pages/people/PeopleTable.vue';

const router = useRouter();
const { list, error, loading, fetchPeople } = usePeople();
const { switchFavorite } = useFavorites();
const { search, data: searchData, loading: searchLoading, error: searchError } = useSearch();

const domInputName = ref<HTMLInputElement | null>(null);

const onPeopleTableFavorite = (index:number) => {
  const person = list.value![index];
  console.log('> PeoplePage -> onFavorite:', person);
  switchFavorite(person);
};
const onSearch = (text:string) => {
  console.log('> PeoplePage -> onSearch:', text);
  const query = text.length > 0 ? { search: text } : undefined;
  router.replace({ ...router.currentRoute.value, query });
  search(text);
};

onMounted(() => {
  const searchText = router.currentRoute.value.query.search?.toString() || '';
  if (searchText.length > 0 && domInputName.value) {
    domInputName.value!.value = searchText;
    search(searchText);
  }
  if (!list.value && !loading.isProgress) {
    console.log('> PeoplePage -> fetchPeople');
    fetchPeople();
  }
});

</script>

<template>
  <div class="pb-4">
    <PeopleSearch
      :loading="searchLoading"
      :error="searchError"
      :results="searchData?.results"
      @search="onSearch"
    />
  </div>
  <div>
    <span class="text-lg font-bold">List of people:</span>
  </div>
  <PeopleLoading v-if="loading.isProgress" :loading="loading" />
  <MessageError v-else-if="error" :error="error" class="mx-auto" />
  <div v-else class="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-100 overflow-y-scroll">
    <PeopleTable :people="list!" @favorite="onPeopleTableFavorite" />
  </div>
</template>
