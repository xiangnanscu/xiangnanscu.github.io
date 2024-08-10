import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "xnscu's blog",
  description: "A blog",
  mpa:false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    lastUpdated: {
      text: '更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },
    sidebar: [
      {
        text: '嵌套',
        items: [
          { text: 'postgresql分页查询优化', link: 'pg/postgresql分页查询优化' },
        ]
      },
      ...generateSidebar({
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
      rootGroupText: 'Contents',
      rootGroupLink: 'https://github.com/jooy2',
      rootGroupCollapsed: false,
      convertSameNameSubFileToGroupIndexPage: false,
      folderLinkNotIncludesFileName: false,
      keepMarkdownSyntaxFromTitle: false,
      debugPrint: false,
    })],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiangnanscu/xiangnanscu.github.io' }
    ]
  }
})
