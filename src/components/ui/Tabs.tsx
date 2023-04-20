import {
  Tab as HuiTab,
  TabGroup as HuiTabGroup,
  TabList as HuiTabList,
  TabPanel as HuiTabPanel,
  TabPanels as HuiTabPanels
} from '@headlessui/vue'
import { FunctionalComponent, Component } from 'vue'

type CompTypes<Comp> = Comp extends Component<infer P> ? P : never

const TabGroup = HuiTabGroup
const TabPanels = HuiTabPanels
const TabList: FunctionalComponent<CompTypes<typeof HuiTabList>> = (props, { slots, attrs }) => {
  return (
    <HuiTabList
      class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      {...props}
      {...attrs}
    >
      {slots.default?.()}
    </HuiTabList>
  )
}
const Tab: FunctionalComponent<CompTypes<typeof HuiTab>> = (props, { slots, attrs }) => {
  return (
    <HuiTab
      class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[headlessui-state=selected]:bg-background data-[headlessui-state=selected]:text-foreground data-[headlessui-state=selected]:shadow-sm"
      {...props}
      {...attrs}
    >
      {slots.default?.()}
    </HuiTab>
  )
}

const TabPanel: FunctionalComponent<CompTypes<typeof HuiTabPanel>> = (props, { slots }) => {
  return (
    <HuiTabPanel
      class="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      {...props}
    >
      {slots.default?.()}
    </HuiTabPanel>
  )
}
export { TabGroup, TabPanels, TabList, Tab, TabPanel }
