const fs = require("fs");
const path = require("path");
const git = require("isomorphic-git");

const LATEST_NUMBER = 10;

async function getFileHistory(filePath) {
  try {
    const commits = await git.log({
      fs,
      dir: process.cwd(),
      filepath: filePath,
    });
    return new Date(commits[commits.length - 1].commit.committer.timestamp * 1000);
  } catch (err) {
    console.error("Error:", err);
  }
}

function extractFirstLevelHeading(markdown) {
  const regex = /^# (.+)$/m;
  const match = markdown.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    return null;
  }
}

const postsDirectory = path.join(process.cwd(), "docs");

async function getLatestPosts(dir) {
  const fileNames = fs.readdirSync(dir);
  let allPostsData = [];
  for (const fileName of fileNames) {
    if (fileName == "index.md") {
      continue;
    }
    const fullPath = path.join(dir, fileName);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      allPostsData = allPostsData.concat(await getLatestPosts(fullPath));
    } else if (fileName.endsWith(".md")) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const title = extractFirstLevelHeading(fileContents);
      allPostsData.push({
        title: title || "Untitled",
        path: path.relative(postsDirectory, fullPath).replace(/\.md$/, ".html"),
        datetime: await getFileHistory(fullPath),
      });
    }
  }

  return allPostsData.sort((a, b) => (a.datetime > b.datetime ? -1 : 1)).slice(0, LATEST_NUMBER);
}

function getChineseDate(date) {
  if (typeof date == "string") {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function main() {
  const latestPosts = await getLatestPosts("./docs");
  // const outputPath = path.join(process.cwd(), "docs", "latest-posts.json");
  // fs.writeFileSync(outputPath, JSON.stringify(latestPosts));
  const lists = [];
  for (const post of latestPosts) {
    lists.push(`<li><a href="${post.path}">${post.title}</a><span>${getChineseDate(post.datetime)}</span></li>`);
  }
  fs.writeFileSync(
    "docs/.vitepress/components/LatestBlog.vue",
    `
<template>
  <ul class="list">
    ${lists.join("\n      ")}
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list li {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.list a {
  display: flex;
  text-decoration: none;
  transition: color 0.2s;
}

.list a:hover {
  color: #2c3e50;
}

.list span {
  color: #666;
  font-size: 0.9em;
  font-family: monospace, "Courier New";
}
</style>`,
  );
}

main();
