import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "xnscu's blog",
  description: "A blog",
  mpa: false,
  lang: 'zh-Hans',
  themeConfig: {
    outline: {
      label: '页面导航'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    editLink: {
      pattern: 'https://github.com/xiangnanscu/xiangnanscu.github.io/edit/master/docs/:path',
      text: '编辑'
    },
    lastUpdated: {
      text: '更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '示例', link: '/markdown-examples' }
    ],
    // https://docsearch.algolia.com/docs/DocSearch-v3
    search: {
      provider: 'algolia',
      options: {
        appId: 'R2IYF7ETH7',
        apiKey: '599cec31baffa4868cae4e79f180729b',
        indexName: 'docsearch',
      }
    },
    sidebar: generateSidebar({
      /*
       * For detailed instructions, see the links below:
       * https://vitepress-sidebar.jooy2.com/guide/api
       */
      documentRootPath: '/docs',
      scanStartPath: null,
      resolvePath: null,
      // useTitleFromFileHeading: true,
      useTitleFromFrontmatter: true,
      frontmatterTitleFieldName: 'title',
      useFolderTitleFromIndexFile: false,
      useFolderLinkFromIndexFile: false,
      hyphenToSpace: true,
      underscoreToSpace: true,
      capitalizeFirst: false,
      capitalizeEachWords: false,
      collapsed: true,
      collapseDepth: 2,
      sortMenusByName: false,
      sortMenusByFrontmatterOrder: false,
      sortMenusByFrontmatterDate: false,
      sortMenusOrderByDescending: false,
      sortMenusOrderNumericallyFromTitle: false,
      sortMenusOrderNumericallyFromLink: false,
      frontmatterOrderDefaultValue: 0,
      manualSortFileNameByPriority: ['first.md', 'second', 'third.md'],
      removePrefixAfterOrdering: false,
      prefixSeparator: '.',
      excludeFiles: ['first.md', 'secret.md'],
      excludeFilesByFrontmatterFieldName: 'exclude',
      excludeFolders: ['secret-folder'],
      includeDotFiles: false,
      includeRootIndexFile: false,
      includeFolderIndexFile: false,
      includeEmptyFolder: false,
      rootGroupText: '目录',
      rootGroupLink: 'https://github.com/xiangnanscu',
      rootGroupCollapsed: false,
      convertSameNameSubFileToGroupIndexPage: false,
      folderLinkNotIncludesFileName: false,
      keepMarkdownSyntaxFromTitle: false,
      debugPrint: false,
    }),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiangnanscu/xiangnanscu.github.io' }
    ]
  }
})
