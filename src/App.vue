<script setup lang="ts">
import LikesPage from './components/LikesPage.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <Suspense>
    <LikesPage />

    <template #fallback>
      <div class="w-screen h-screen flex items-center justify-center">
        <ArrowPathIcon class="w-8 h-8 animate-spin" />
      </div>
    </template>
  </Suspense>
</template>
