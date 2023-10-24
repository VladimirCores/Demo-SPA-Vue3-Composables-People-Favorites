<script setup lang="ts">
import { useRoute } from 'vue-router';

import routes, { IRoute } from '~/constants/routes.ts';

const possibleRoutes = [
  { ...routes.HOME },
  { ...routes.PEOPLE },
  { ...routes.FAVORITES },
];

const currentRoute = useRoute();
const isRouteCurrent = ({ path }: IRoute) => path === currentRoute.path;
</script>

<template>
  <div class="[&>*:not(:last-child)]:mr-2">
    <template
      v-for="route in possibleRoutes"
      :key="route.path"
    >
      <span v-if="isRouteCurrent(route)">{{ route.name }}</span>
      <router-link
        v-else
        :to="route.path"
        class="link"
      >
        <span>{{ route.name }}</span>
      </router-link>
    </template>
  </div>
</template>

