
<template>
  <div>
    <h2>latest blogs</h2>
    <ul>
      <li><a href="postgresql/about-pg-insert-or-get_or_create.html">insert</a><span>2024-8-12</span></li>
      <li><a href="postgresql/postgresql分页查询优化.html">优化查询获取总记录数</a><span>2024-8-12</span></li>
      <li><a href="postgresql/postgresql如何获取最大连接数.html">postgresql如何获取最大连接数</a><span>2024-8-12</span></li>
      <li><a href="读后感/智能时代.html">智能时代</a><span>2024-8-12</span></li>
      <li><a href="随笔/占位符.html">第一篇随笔</a><span>2024-8-12</span></li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

a {
  display: flex;
  color: var(--vp-home-hero-name-color);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #2c3e50;
}

span {
  color: #666;
  font-size: 0.9em;
}
</style>

  