<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useFavorite, usePeople, useSearch } from '~/composables';

import routes from '~/constants/routes.ts';

import MessageError from '~/components/message/MessageError.vue';
import PeopleLoading from '~/components/pages/people/PeopleLoading.vue';
import PeopleTable from '~/components/pages/people/PeopleTable.vue';

const router = useRouter();
const { list, error, loading } = usePeople();
const { switchFavorite } = useFavorite();
const { search, result: searchResult, loading: searchLoading, error: searchError } = useSearch();

const onPeopleTableFavorite = (index:number) => {
  console.log('> PeoplePage -> onFavorite:', index);
  switchFavorite(index);
};
const onInputPeopleName = (event:Event) => {
  const domInput =  event.currentTarget as HTMLInputElement;
  console.log('> PeoplePage -> onInputPeopleName:', domInput.value);
  const value = domInput.value;
  const query = value.length > 0 ? { search: value } : undefined;
  router.replace({ ...router.currentRoute.value, query });
  search(value);
};
</script>

<template>
  <div class="pb-4">
    <div class="dropdown dropdown-end w-72">
      <input
        type="text"
        placeholder="Type people name here"
        class="input input-bordered input-sm w-full max-w-xs"
        @input="onInputPeopleName"
      >
      <div tabindex="0" class="card compact dropdown-content z-[10] shadow bg-base-100 rounded-box w-full mt-1 border">
        <div class="card-body">
          <span class="card-title text-sm">
            Type to search people?
          </span>
          <div v-if="searchLoading" class="flex flex-row items-center space-x-2">
            <span class="loading loading-spinner loading-xs text-accent" />
            <span class="text-xs">
              Loading...
            </span>
          </div>
          <MessageError v-else-if="searchError" :error="searchError" />
          <div v-else-if="searchResult">
            <ul class="menu bg-base-200 rounded-box">
              <li v-for="(item, index) in searchResult.results" :key="index">
                <router-link :to="`${routes.PEOPLE.path}${item.id}`">
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
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
