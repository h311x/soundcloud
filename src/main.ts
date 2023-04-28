import { createApp } from 'vue'
import './styles.css'
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Infinity
      }
    }
  }
})
app.mount('#app')
