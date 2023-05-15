<!--eslint-disable-line-->
<script setup lang="ts">
import { InputHTMLAttributes } from 'vue'

interface Props extends /* @vue-ignore */ InputHTMLAttributes {}
defineProps<Props>()

const modelValue = defineModel<string>()
</script>

<template>
  <input
    v-model="modelValue"
    class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    type="text"
  />
</template>
