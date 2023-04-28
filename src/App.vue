<script setup lang="ts">
import LikesPage from './pages/LikesPage.vue'
import { ArrowPathIcon, HeartIcon, QueueListIcon } from '@heroicons/vue/24/solid'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from './components/ui/Tabs'
import ControlsBar from './components/ControlsBar.vue'
import WeeklyPlaylistPage from './pages/WeeklyPlaylistPage.vue'
import GlobalControlsProvider from './components/providers/GlobalControlsProvider.vue'
</script>

<template>
  <Suspense>
    <GlobalControlsProvider>
      <div class="flex flex-col h-screen">
        <div class="flex grow h-full">
          <TabGroup vertical>
            <TabList class="h-full flex flex-col !justify-start">
              <Tab>
                <HeartIcon class="w-6 h-6" />
              </Tab>
              <Tab>
                <QueueListIcon class="w-6 h-6" />
              </Tab>
            </TabList>

            <TabPanels class="grow flex flex-col relative w-full h-full">
              <TabPanel class="flex flex-col grow">
                <Suspense>
                  <LikesPage class="grow h-0" />
                  <template #fallback>
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <ArrowPathIcon class="w-8 h-8 animate-spin" />
                    </div>
                  </template>
                </Suspense>
              </TabPanel>

              <TabPanel class="flex flex-col grow">
                <Suspense>
                  <WeeklyPlaylistPage class="grow h-0" />
                  <template #fallback>
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <ArrowPathIcon class="w-8 h-8 animate-spin" />
                    </div>
                  </template>
                </Suspense>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>

        <ControlsBar />
      </div>
    </GlobalControlsProvider>
  </Suspense>
</template>
