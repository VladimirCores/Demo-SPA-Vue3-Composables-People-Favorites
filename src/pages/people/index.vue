<script setup lang="ts">
import { usePeople } from '~/composables';

import MessageError from '~/components/message/MessageError.vue';
import PeopleLoading from '~/components/pages/people/PeopleLoading.vue';
import PeopleTable from '~/components/pages/people/PeopleTable.vue';

const { list, error, loading, switchFavorite } = usePeople();

const onFavorite = (index:number) => {
  console.log('> PeoplePage -> onFavorite:', index);
  switchFavorite(index);
};
</script>

<template>
  <div class="pb-4">
    <div class="dropdown dropdown-end w-full">
      <input type="text" placeholder="Type people name here" class="input input-bordered input-sm w-full max-w-xs">
      <div tabindex="0" class="card compact dropdown-content z-[10] shadow bg-base-100 rounded-box w-full">
        <div class="card-body">
          <span class="card-title text-sm">
            Type to search people?
          </span>
          <p>Nothing here!</p>
        </div>
      </div>
    </div>
  </div>
  <div>
    <span class="text-lg font-bold">List of people:</span>
  </div>
  <PeopleLoading v-if="loading.isProgress" :loading="loading" />
  <MessageError v-else-if="error" :error="error" class="mx-auto" />
  <div v-else class="overflow-x-auto">
    <PeopleTable :people="list!" @favorite="onFavorite" />
  </div>
</template>
