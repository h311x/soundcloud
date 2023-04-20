<script setup lang="ts">
import LikesPage from './components/LikesPage.vue'
import { ArrowPathIcon, HeartIcon, QueueListIcon } from '@heroicons/vue/24/solid'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from './components/ui/Tabs'
</script>

<template>
  <Suspense>
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
          <TabPanel>
            <LikesPage />
          </TabPanel>

          <TabPanel> `Yo </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
    <template #fallback>
      <div class="w-screen h-screen flex items-center justify-center">
        <ArrowPathIcon class="w-8 h-8 animate-spin" />
      </div>
    </template>
  </Suspense>
</template>
