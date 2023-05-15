<script lang="ts" setup>
import { Song } from '../utils'
import { computed, watch } from 'vue'
import Autocomplete from '../lib/autocomplete'
import Input from './ui/Input.vue'

const props = defineProps<{ modelValue: string; list: Song[] }>()

const autocomplete = new Autocomplete()
props.list.forEach((el) => {
  autocomplete.add(el.title.toLowerCase(), el.title)
  autocomplete.add(el.username.toLowerCase(), el.username)
})

const modelValue = defineModel<string>()

const autocompleteOption = computed(() => {
  if (!modelValue.value) return ''
  console.time('Search')
  const r = autocomplete.search(modelValue.value.toLowerCase())
  console.timeEnd('Search')
  return modelValue.value + (r[0] ?? '')
})

watch(autocompleteOption, (v) => console.log(v))
</script>

<template>
  <div class="relative">
    <Input
      v-if="modelValue"
      class="text-muted-foreground absolute w-full h-full top-0 left-0 -z-10"
      disabled
      v-model="autocompleteOption"
    />

    <Input
      class="bg-transparent"
      v-model="modelValue"
      placeholder="Type to search..."
      spellcheck="false"
    />
  </div>
</template>
