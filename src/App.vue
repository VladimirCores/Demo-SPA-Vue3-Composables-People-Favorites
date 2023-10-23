<script setup lang="ts">
import HeaderNavigation from '~/components/HeaderNavigation.vue';

</script>

<template>
  <div class="flex flex-col items-center container mx-auto h-full">
    <div class="py-4">
      <HeaderNavigation />
    </div>
    <router-view />
  </div>
</template>

