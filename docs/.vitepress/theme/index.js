// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";

import giscusTalk from "vitepress-plugin-comment-with-giscus";
import { useData, useRoute } from "vitepress";
import { toRefs } from "vue";

export default {
  extends: DefaultTheme,
  // 使用注入插槽的包装组件覆盖 Layout
  Layout: MyLayout,
  setup() {
    // Get frontmatter and route
    const { frontmatter } = toRefs(useData());
    const route = useRoute();

    // Obtain configuration from: https://giscus.app/
    giscusTalk(
      {
        repo: "xiangnanscu/xiangnanscu.github.io",
        repoId: "R_kgDOHj14pA",
        category: "Announcements", // default: `General`
        categoryId: "DIC_kwDOHj14pM4Cc6jT",
        mapping: "pathname", // default: `pathname`
        inputPosition: "bottom", // default: `top`
        lang: "zh-CN", // default: `zh-CN`
        // i18n setting (Note: This configuration will override the default language set by lang)
        // Configured as an object with key-value pairs inside:
        // [your i18n configuration name]: [corresponds to the language pack name in Giscus]
        locales: {
          "zh-Hans": "zh-CN",
          "en-US": "en",
        },
        homePageShowComment: false, // Whether to display the comment area on the homepage, the default is false
        lightTheme: "light", // default: `light`
        darkTheme: "transparent_dark", // default: `transparent_dark`
        reactionsEnabled: "1",
        strict: "1",
        loading: "lazy",
        // ...
      },
      {
        frontmatter,
        route,
      },
      // Whether to activate the comment area on all pages.
      // The default is true, which means enabled, this parameter can be ignored;
      // If it is false, it means it is not enabled.
      // You can use `comment: true` preface to enable it separately on the page.
      true,
    );
  },
};
