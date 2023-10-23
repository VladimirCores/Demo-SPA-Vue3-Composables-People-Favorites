<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import routes, { IRoute } from '~/constants/routes.ts';

const possibleRoutes = [
  { ...routes.HOME },
  { ...routes.PEOPLE },
  { ...routes.FAVORITES },
];

const currentRoute = useRoute();
const isRouteNotCurrent = ({ path }: IRoute) => path !== currentRoute.path;
const visibleRoutes = computed(() => possibleRoutes.filter(isRouteNotCurrent));
</script>

<template>
  <div class="[&>*:not(:last-child)]:mr-2">
    <router-link
      v-for="route in visibleRoutes"
      :key="route.path"
      :disabled="isRouteNotCurrent(route)"
      :to="route.path"
      class="link"
    >
      <span>{{ route.name }}</span>
    </router-link>
  </div>
</template>

