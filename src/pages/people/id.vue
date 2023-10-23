<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useFavorite, usePerson } from '~/composables';
import { IPerson } from '~/interfaces';

import MessageError from '~/components/message/MessageError.vue';

const route = useRoute();
const person = usePerson();
const { switchFavorite } = useFavorite();
const isLoading = ref(true);
const error = ref(null);
const data = ref<IPerson | undefined>();

const getPersonId = computed<number>(() => parseInt(route.params.id as string));
const getPersonKeys = computed<string[]>(() => Object.keys(data.value!));

const fetchPerson = () => {
  isLoading.value = true;
  console.log('> PersonIdPage -> fetchPerson');
  person.fetchById(getPersonId.value)
    .then((result) => data.value = result)
    .finally(() => isLoading.value = false);
};

const onFavorite = () => {
  console.log('> PersonIdPage -> onFavorite');
  switchFavorite(getPersonId.value, data.value);
};

onMounted(() => {
  fetchPerson();
});

watch(route, () => fetchPerson());

</script>

<template>
  <div v-if="isLoading" class="flex flex-col justify-center items-center h-full">
    <span class="loading loading-spinner loading-lg text-accent" />
  </div>
  <MessageError v-else-if="error" :error="error" />
  <div v-else class="flex flex-col justify-center w-full">
    <div v-if="!data!.favorite" class="flex flex-row justify-end w-full space-x-2">
      <span>Favorite</span>
      <label>
        <input
          type="checkbox"
          class="checkbox checkbox-sm"
          :checked="data!.favorite"
          @change="onFavorite"
        >
      </label>
    </div>
    <div class="flex flex-row justify-start items-start w-full">
      <table class="table table-xl">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(key, index) in getPersonKeys" :key="index">
            <th class="text-neutral/80">
              {{ key }}
            </th>
            <th class="text-base-content">
              {{ data![key] }}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
