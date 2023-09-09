import './style.css'
// import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
import 'primeflex/primeflex.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import primelocale from 'primelocale/zh-CN.json'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  inputStyle: 'filled',
  ripple: true,
  locale: primelocale['zh-CN']
})

app.mount('#app')
