<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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

const isLoadingNotComplete = computed(() => loading.progress.current !== loading.progress.final);

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

const onRestart = () => {
  console.log('> PeoplePage -> onRestart');
  fetchPeople();
};

onMounted(() => {
  const searchText = router.currentRoute.value.query.search?.toString() || '';
  if (searchText.length > 0 && domInputName.value) {
    domInputName.value!.value = searchText;
    search(searchText);
  }
  if (isLoadingNotComplete.value && (!loading.isProgress || error.value)) {
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
  <PeopleLoading v-if="isLoadingNotComplete && !error" :loading="loading" class="py-2" />
  <MessageError v-if="error" :error="error" class="mx-auto">
    <button class="btn btn-xs" @click="onRestart">
      Restart from last page
    </button>
  </MessageError>
  <div v-if="loading.progress.current > 1" class="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-100 overflow-y-scroll">
    <PeopleTable :key="list.length" :people="list" @favorite="onPeopleTableFavorite" />
  </div>
</template>
