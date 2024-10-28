# systemctl彻底删除postfix服务

### 1. 停止并禁用 `postfix` 服务
```bash
sudo systemctl stop postfix
sudo systemctl disable postfix
```

### 2. 卸载 `postfix` 软件包
```bash
sudo apt-get remove --purge postfix
```

### 3. 重新加载 systemd 配置
```bash
sudo systemctl daemon-reload
```

### 4. 验证删除
你可以通过以下命令验证服务是否已被删除：
```bash
systemctl status postfix
```

### 5. 清理残留（可选）
如果 `postfix` 有其他相关的配置文件或目录，你可能还需要手动删除它们。例如，如果 `postfix` 在 `/etc/postfix` 或 `/var/spool/postfix` 等目录下有配置文件，你可以删除这些目录：
```bash
sudo rm -rf /etc/postfix
sudo rm -rf /var/spool/postfix
```

### 总结
通过以上步骤，你应该能够成功删除 `mail-service.service` 和 `postfix`。以下是所有命令的整合：

```bash
sudo systemctl stop postfix
sudo systemctl disable postfix
sudo apt-get remove --purge postfix
sudo systemctl daemon-reload
systemctl status postfix
sudo rm -rf /etc/postfix
sudo rm -rf /var/spool/postfix
```
### bonus
```bash
sudo systemctl stop mail-service.service
sudo systemctl disable mail-service.service
sudo rm /etc/systemd/system/mail-service.service
```