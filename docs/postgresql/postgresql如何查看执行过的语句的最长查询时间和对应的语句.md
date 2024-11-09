# postgresql如何查看执行过的语句的最长查询时间和对应的语句

在 PostgreSQL 中，可以通过启用查询日志来查看执行过的语句及其执行时间。以下是实现步骤：

## 1. 修改 PostgreSQL 配置

在 PostgreSQL 的配置文件 `postgresql.conf` 中，设置以下参数：

```plaintext
log_statement = 'all'          # 记录所有语句
log_duration = on              # 记录每个语句的执行时间
```

如果只想记录执行时间超过一定阈值的语句，可以设置：

```plaintext
log_min_duration_statement = 1000  # 记录执行时间超过1000毫秒的语句
```

## 2. 重新加载配置

修改配置后，使用以下命令重新加载配置：
```sh
service postgresql start
```
或者在psql里面执行:
```sql
SELECT pg_reload_conf();
```

## 3. 查看日志

查询日志文件通常位于 PostgreSQL 数据目录下的 `pg_log` 文件夹中。你可以使用命令行工具（如 `cat`、`less` 或 `grep`）查看日志文件。

## 4. 使用 pg_stat_statements 插件

如果你希望更方便地查看执行过的语句及其统计信息，可以使用 `pg_stat_statements` 插件：

1. **启用插件**：

在 `postgresql.conf` 中添加：

```plaintext
shared_preload_libraries = 'pg_stat_statements'
```

2. **创建扩展**：

在数据库中执行：

```sql
CREATE EXTENSION pg_stat_statements;
```

3. **查询统计信息**：

使用以下 SQL 查询获取执行过的语句及其最长和平均执行时间：

```sql
SELECT query, calls, total_exec_time, rows, shared_blks_hit, shared_blks_read
FROM pg_stat_statements
ORDER BY calls DESC;
```

## 5. 监控和清理

注意，`pg_stat_statements` 统计信息会随着时间累积，可能会占用较多内存。可以定期清理或重置统计信息：

```sql
SELECT pg_stat_statements_reset();
```

通过上述步骤，你可以有效地查看 PostgreSQL 中执行过的语句及其执行时间。
