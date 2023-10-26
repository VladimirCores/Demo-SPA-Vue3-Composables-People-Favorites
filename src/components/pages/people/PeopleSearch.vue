<script setup lang="ts">

import { ref } from 'vue';

import { IPerson } from '~/interfaces';

import routes from '~/constants/routes';

import MessageError from '~/components/message/MessageError.vue';

defineProps<{
  results?: IPerson[],
  loading: boolean,
  error?: string | undefined,
}>();

const emit = defineEmits<{
  (e: 'search', text: string): void
}>();

const domInputName = ref<HTMLInputElement | null>(null);

const onInputName = () => {
  const domInput =  domInputName.value as HTMLInputElement;
  console.log('> PeopleSearch -> onInputName:', domInput.value);
  emit('search', domInput.value);
};

</script>

<template>
  <div class="dropdown dropdown-end w-72">
    <input
      ref="domInputName"
      type="text"
      placeholder="Type people name here"
      class="input input-bordered input-sm w-full max-w-xs"
      @input="onInputName"
    >
    <div tabindex="0" class="card compact dropdown-content z-[10] shadow bg-base-100 rounded-box w-full mt-1 border">
      <div class="card-body">
        <span class="card-title text-sm">
          Type to search people?
        </span>
        <div v-if="loading" class="flex flex-row items-center space-x-2">
          <span class="loading loading-spinner loading-xs text-accent" />
          <span class="text-xs">
            Loading...
          </span>
        </div>
        <MessageError v-else-if="error" :error="error" />
        <div v-else-if="results">
          <ul class="menu bg-base-200 rounded-box">
            <li v-for="(item, index) in results" :key="index">
              <router-link :to="`${routes.PEOPLE.path}/${item.id}`">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
