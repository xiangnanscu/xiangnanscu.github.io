# Vue3+Vite+json-server后端数据模拟框架

**示例项目结构：**

```
vite-vue3-json-server-example/
├── index.html
├── mock/             # json-server 数据和启动脚本目录
│   ├── db.json       # 模拟数据文件
│   └── server.js     # json-server 启动脚本
├── package.json
├── public/
│   └── vite.svg
├── src/
│   ├── App.vue
│   ├── assets/
│   │   └── main.css
│   ├── components/
│   │   └── PostList.vue  # 显示文章列表的组件
│   └── main.js
├── vite.config.js
├── yarn.lock        (或者 package-lock.json)
└── README.md
```

**步骤：**

**1. 创建 Vite + Vue3 项目**

如果你还没有项目，可以使用 Vite 快速创建一个：

```bash
npm create vite@latest vite-vue3-json-server-example --template vue
cd vite-vue3-json-server-example
npm install
```

**2. 安装 `json-server` 和 `axios`**

```bash
npm install json-server axios -D  # json-server 作为开发依赖
npm install axios               # axios 作为项目依赖
```

**3. 创建 `json-server` 模拟数据和启动脚本**

* **创建 `mock` 目录和 `db.json` 文件:**

   在项目根目录下创建 `mock` 文件夹，并在其中创建 `db.json` 文件，用于存放模拟数据。

   ```json
   // mock/db.json
   {
     "posts": [
       { "id": 1, "title": "Vue 3 Composition API", "author": "Evan You" },
       { "id": 2, "title": "Vite: The Next Generation Frontend Tooling", "author": "Evan You" },
       { "id": 3, "title": "Axios for HTTP Requests", "author": "Your Name" }
     ]
   }
   ```

* **创建 `json-server` 启动脚本 `server.js`:**

   在 `mock` 目录下创建 `server.js` 文件，用于启动 `json-server`。

   ```javascript
   // mock/server.js
   const jsonServer = require('json-server');
   const server = jsonServer.create();
   const router = jsonServer.router('mock/db.json'); // 指向 db.json 文件
   const middlewares = jsonServer.defaults();

   server.use(middlewares);
   server.use(router);

   const port = 3000; // 可以自定义端口
   server.listen(port, () => {
     console.log(`JSON Server is running on http://localhost:${port}`);
   });
   ```

* **在 `package.json` 中添加启动 `json-server` 的脚本:**

   打开 `package.json` 文件，在 `scripts` 部分添加一个 `mock` 脚本，用于启动 `json-server`。

   ```json
   // package.json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "mock": "node mock/server.js"  // 添加 mock 脚本
     },
     // ...
   }
   ```

   现在你可以使用 `npm run mock` 或 `yarn mock` 命令来启动 `json-server`。 它将在 `http://localhost:3000` 提供 API 服务。

**4. 在 Vue 组件中使用 Axios 获取数据**

* **创建 `PostList.vue` 组件:**

   在 `src/components` 目录下创建 `PostList.vue` 组件，用于显示文章列表，并使用 Axios 从 `json-server` 获取数据。

   ```vue
   <template>
     <div>
       <h2>文章列表</h2>
       <ul>
         <li v-for="post in posts" :key="post.id">
           <h3>{{ post.title }}</h3>
           <p>作者: {{ post.author }}</p>
         </li>
       </ul>
     </div>
   </template>

   <script setup>
   import { ref, onMounted } from 'vue';
   import axios from 'axios';

   const posts = ref([]);

   onMounted(async () => {
     try {
       const response = await axios.get('/posts'); // 注意：这里使用相对路径 '/posts'
       posts.value = response.data;
     } catch (error) {
       console.error('获取文章列表失败:', error);
     }
   });
   </script>

   <style scoped>
   ul {
     list-style: none;
     padding: 0;
   }
   li {
     margin-bottom: 20px;
     padding: 15px;
     border: 1px solid #ccc;
     border-radius: 5px;
   }
   h3 {
     margin-top: 0;
   }
   </style>
   ```

* **在 `App.vue` 中使用 `PostList` 组件:**

   打开 `src/App.vue` 文件，引入并使用 `PostList` 组件。

   ```vue
   <template>
     <div>
       <h1>Vite + Vue 3 + JSON Server Example</h1>
       <PostList />
     </div>
   </template>

   <script setup>
   import PostList from './components/PostList.vue';
   </script>

   <style scoped>
   #app {
     font-family: Avenir, Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #2c3e50;
     margin-top: 60px;
   }
   </style>
   ```

**5. 配置 Vite 开发服务器代理 (可选，但推荐)**

在开发环境中，Vite 的开发服务器通常运行在不同的端口（例如 `http://localhost:5173`），而 `json-server` 默认运行在 `http://localhost:3000`。  为了避免跨域问题，并让前端代码可以使用相对路径 `/posts` 访问 `json-server`，我们可以在 `vite.config.js` 中配置 Vite 的开发服务器代理。

* **修改 `vite.config.js`:**

   打开 `vite.config.js` 文件，添加 `server.proxy` 配置。

   ```javascript
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [vue()],
     server: {
       proxy: {
         '/posts': {  // 代理所有以 /posts 开头的请求
           target: 'http://localhost:3000', // json-server 的地址
           changeOrigin: true,  // 允许跨域
           // rewrite: (path) => path.replace(/^\/api/, '') // 如果你的 json-server 前缀不是 /api，可以去掉 rewrite
         }
       }
     }
   })
   ```

   配置了代理后，在 `PostList.vue` 组件中，Axios 请求的路径就可以使用相对路径 `/posts`，Vite 开发服务器会自动将请求代理到 `http://localhost:3000/posts`。

**6. 运行项目**

* **同时启动 Vite 开发服务器和 `json-server`:**

   打开两个终端窗口：

   * **终端 1 (启动 `json-server`):**

     ```bash
     npm run mock
     # 或 yarn mock
     ```

   * **终端 2 (启动 Vite 开发服务器):**

     ```bash
     npm run dev
     # 或 yarn dev
     ```

* **访问应用:**

   在浏览器中访问 Vite 开发服务器地址（通常是 `http://localhost:5173`），你应该能看到 "文章列表" 组件显示从 `json-server` 获取的数据。

**完整流程总结：**

1. **创建 Vite + Vue3 项目并安装依赖 (`json-server`, `axios`).**
2. **创建 `mock` 目录，包含 `db.json` (模拟数据) 和 `server.js` (启动 `json-server` 脚本).**
3. **在 `package.json` 中添加 `mock` 脚本启动 `json-server`.**
4. **创建 Vue 组件 (`PostList.vue`)，使用 Axios 发送 GET 请求到 `/posts` 获取数据.**
5. **在 `vite.config.js` 中配置开发服务器代理，将 `/posts` 请求代理到 `json-server` (可选但推荐).**
6. **同时运行 `json-server` (`npm run mock`) 和 Vite 开发服务器 (`npm run dev`).**
7. **在浏览器中访问 Vite 应用，查看效果.**

这个示例展示了如何在 Vite + Vue3 + Axios 项目中整合 `json-server` 来模拟后端数据，方便开发和测试。你可以根据自己的需求扩展 `db.json` 中的数据，以及 `PostList.vue` 组件的功能。