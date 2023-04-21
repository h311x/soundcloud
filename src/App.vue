<script setup lang="ts">
import LikesPage from './components/LikesPage.vue'
import { ArrowPathIcon, HeartIcon, QueueListIcon } from '@heroicons/vue/24/solid'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from './components/ui/Tabs'
import { createGlobalControls } from './composables/useGlobalControls'

createGlobalControls()
</script>

<template>
  <div class="flex">
    <TabGroup vertical>
      <TabList class="h-screen flex flex-col !justify-start">
        <Tab>
          <HeartIcon class="w-6 h-6" />
        </Tab>
        <Tab>
          <QueueListIcon class="w-6 h-6" />
        </Tab>
      </TabList>

      <TabPanels class="grow">
        <TabPanel class="relative w-full h-full">
          <Suspense>
            <LikesPage />
            <template #fallback>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ArrowPathIcon class="w-8 h-8 animate-spin" />
              </div>
            </template>
          </Suspense>
        </TabPanel>

        <TabPanel> Playlists placeholder </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>
