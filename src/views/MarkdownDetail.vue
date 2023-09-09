<script setup lang="js">
import { getContent } from './markdowns.js'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/github.css'
import javascript from 'highlight.js/lib/languages/javascript'
import lua from 'highlight.js/lib/languages/lua'
import sql from 'highlight.js/lib/languages/sql'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('lua', lua)
hljs.registerLanguage('sql', sql)

// const props = defineProps({
//   name: String
// })
const md = new MarkdownIt({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const code = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        console.log({ code })
        return `<pre class="hljs"><code>${code}</code></pre>`
      } catch (error) {
        console.error(error)
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})
const route = useRoute()
const name = route.query.name
const content = md.render(await getContent(name))
</script>

<template>
  <div v-html="content"></div>
</template>

<style></style>
