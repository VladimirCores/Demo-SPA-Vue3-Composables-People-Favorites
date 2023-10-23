<script setup lang="ts">
import MainNavigation from '~/components/MainNavigation.vue';

</script>

<template>
  <div class="flex flex-col items-center">
    <MainNavigation />
    <router-view />
  </div>
</template>

