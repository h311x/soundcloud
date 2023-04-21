<script lang="ts" setup>
import Input from './ui/Input'
import { useVModel } from '@vueuse/core'
import { Song } from '../utils'
import { computed, watch } from 'vue'
import Autocomplete from '../lib/autocomplete'

const props = defineProps<{ modelValue: string; list: Song[] }>()

const autocomplete = new Autocomplete()
props.list.forEach((el) => {
  autocomplete.add(el.title.toLowerCase(), el.title)
  autocomplete.add(el.username.toLowerCase(), el.username)
})

const emit = defineEmits<{
  (e: 'update:modelValue'): void
}>()

const search = useVModel(props, 'modelValue', emit)

const autocompleteOption = computed(() => {
  if (!search.value) return ''
  console.time('Search')
  const r = autocomplete.search(search.value.toLowerCase())
  console.timeEnd('Search')
  return search.value + (r[0] ?? '')
})

watch(autocompleteOption, (v) => console.log(v))
</script>

<template>
  <div class="relative">
    <Input
      v-if="search"
      class="text-muted-foreground absolute w-full h-full top-0 left-0 -z-10"
      disabled
      v-model="autocompleteOption"
    />

    <Input
      class="bg-transparent"
      v-model="search"
      placeholder="Type to search..."
      spellcheck="false"
    />
  </div>
</template>
