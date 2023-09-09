/// <reference types="vite/client" />
import 'pinia'
import type { Router } from 'vue-router'
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // // by using a setter we can allow both strings and refs
    // set hello(value: string | Ref<string>);
    // get hello(): string;

    // // you can define simpler values too
    // simpleNumber: number;

    // type the router added by the plugin above (#adding-new-external-properties)
    router: Router
  }
}
