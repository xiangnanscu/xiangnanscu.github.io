# ubuntu如何结束top命令显示COMMAND对应名称的进程?

在 Ubuntu 中，如果你想终止由 `sync-uni.sh` 脚本发起的进程，可以使用 `top` 命令找到该进程的 PID（进程 ID），然后使用 `kill` 命令终止该进程。以下是具体步骤：


## 使用 `pgrep` 和 `pkill` 命令


1. 使用 `pgrep` 查找 `sync-uni.sh` 进程的 PID：

   ```bash
   pgrep -f sync-uni.sh
   ```

   这将返回 `sync-uni.sh` 进程的 PID。

2. 使用 `pkill` 终止进程：

   ```bash
   pkill -f sync-uni.sh
   ```

   这将终止所有匹配 `sync-uni.sh` 的进程。

### 总结
通过以上步骤，你可以使用 `top` 命令找到 `sync-uni.sh` 进程的 PID，然后使用 `kill` 或 `pkill` 命令终止该进程。