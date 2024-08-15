import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
// https://github.com/vuejs/vitepress/blob/main/docs/.vitepress/config/zh.ts
export default defineConfig({
  title: "xnscu",
  // description: "由 Vite 和 Vue 驱动的静态站点生成器",
  mpa: false,
  lang: "zh-Hans",
  cleanUrls: true,
  // locales: {
  //   root: {
  //     label: "English",
  //     lang: "en",
  //   },
  //   zh: { label: "简体中文", lang: "zh" },
  // },
  head: [
    [
      "script",
      {
        defer: "",
        src: "https://static.cloudflareinsights.com/beacon.min.js",
        "data-cf-beacon": '{"token": "2595614415824c6c86cb58b36566cd3d"}',
      },
    ],
  ],
  themeConfig: {
    logo: { src: "/vitepress-logo-mini.svg", width: 24, height: 24 },
    outline: {
      label: "页面导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    editLink: {
      pattern: "https://github.com/xiangnanscu/xiangnanscu.github.io/edit/master/docs/:path",
      text: "编辑",
    },
    lastUpdated: {
      text: "更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: "home", link: "/" },
      // { text: "示例", link: "/markdown-examples" },
    ],
    // https://docsearch.algolia.com/docs/DocSearch-v3
    search: {
      provider: "algolia",
      options: {
        appId: "2LM7DM5P4O",
        apiKey: "900a2602ae8f4a8a32d58e3e8a2f282c",
        indexName: "docsearch",
      },
    },
    socialLinks: [{ icon: "github", link: "https://github.com/xiangnanscu/xiangnanscu.github.io" }],
    sidebar: generateSidebar({
      /*
       * For detailed instructions, see the links below:
       * https://vitepress-sidebar.jooy2.com/guide/api
       */
      documentRootPath: "/docs",
      // scanStartPath: null, // will trigger ts error
      // resolvePath: null, // will trigger ts error
      // useTitleFromFileHeading: true,
      useTitleFromFrontmatter: true,
      frontmatterTitleFieldName: "title",
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
      manualSortFileNameByPriority: ["first.md", "second", "third.md"],
      removePrefixAfterOrdering: false,
      prefixSeparator: ".",
      excludeFiles: ["first.md", "secret.md"],
      excludeFilesByFrontmatterFieldName: "exclude",
      excludeFolders: ["secret-folder"],
      includeDotFiles: false,
      includeRootIndexFile: false,
      includeFolderIndexFile: false,
      includeEmptyFolder: false,
      rootGroupText: "目录",
      rootGroupLink: "https://github.com/xiangnanscu",
      rootGroupCollapsed: false,
      convertSameNameSubFileToGroupIndexPage: false,
      folderLinkNotIncludesFileName: false,
      keepMarkdownSyntaxFromTitle: false,
      debugPrint: false,
    }),
  },
});
