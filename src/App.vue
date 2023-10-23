<script setup lang="ts">
import HeaderNavigation from '~/components/HeaderNavigation.vue';

</script>

<template>
  <div class="flex flex-col items-center">
    <HeaderNavigation />
    <router-view />
  </div>
</template>

