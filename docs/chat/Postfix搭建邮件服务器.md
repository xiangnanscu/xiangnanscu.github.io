# Postfix搭建邮件服务器
## 配置服务器
要搭建一个邮件服务器，并将收到的邮件信息存储在 PostgreSQL 数据库中，同时通过 HTTP 方式查看收信和发信的数据，还能配置收信代理邮箱，可以按照以下步骤进行。我们将使用 Postfix 作为邮件传输代理（MTA），Dovecot 作为邮件投递代理（MDA），并使用 Nginx 作为 Web 服务器。

### 1. 准备工作

确保你有以下条件：
- 一台运行 Linux 操作系统的服务器（推荐使用 Ubuntu 或 Debian）。
- 一个域名（如 mail.xnscu.com）。
- 安装 PostgreSQL 数据库。
- 安装 Nginx 作为 Web 服务器。
- 安装 Python 或 Node.js 环境。

### 2. 配置 DNS

在你的 DNS 提供商处配置以下记录：

- **A记录**: 将 mail.xnscu.com 指向你的服务器 IP 地址。
- **MX记录**: 将 mail.xnscu.com 的优先级设置为 10，指向 mail.xnscu.com。
- **SPF记录**: 添加 SPF 记录以防止垃圾邮件，例如：`v=spf1 a mx -all`
- **DKIM记录**: 配置 DKIM 以验证发件人身份。
- **DMARC记录**: 配置 DMARC 以帮助接收邮件服务器处理来自你域的邮件。

### 3. 安装和配置 Postfix

安装 Postfix：
```bash
sudo apt update
sudo apt install postfix postfix-pgsql
```

配置 Postfix：
编辑 `/etc/postfix/main.cf` 文件，添加或修改以下内容：
```bash
myhostname = mail.xnscu.com
mydomain = xnscu.com
myorigin = $mydomain
inet_interfaces = all
inet_protocols = ipv4
mydestination = $myhostname, localhost.$mydomain, localhost
relayhost =
mynetworks = 127.0.0.0/8
mailbox_size_limit = 0
recipient_delimiter = +
virtual_mailbox_domains = pgsql:/etc/postfix/pgsql/virtual_domains_maps.cf
virtual_mailbox_maps = pgsql:/etc/postfix/pgsql/virtual_mailbox_maps.cf
virtual_alias_maps = pgsql:/etc/postfix/pgsql/virtual_alias_maps.cf
virtual_transport = lmtp:unix:private/dovecot-lmtp
```

创建 PostgreSQL 配置文件：
```bash
sudo mkdir -p /etc/postfix/pgsql
```

创建 `/etc/postfix/pgsql/virtual_domains_maps.cf` 文件，内容如下：
```bash
user = postfix
password = your_postfix_password
dbname = postfix
query = SELECT domain FROM domain WHERE domain='%s'
```

创建 `/etc/postfix/pgsql/virtual_mailbox_maps.cf` 文件，内容如下：
```bash
user = postfix
password = your_postfix_password
dbname = postfix
query = SELECT maildir FROM mailbox WHERE username='%s'
```

创建 `/etc/postfix/pgsql/virtual_alias_maps.cf` 文件，内容如下：
```bash
user = postfix
password = your_postfix_password
dbname = postfix
query = SELECT goto FROM alias WHERE address='%s'
```

### 4. 安装和配置 Dovecot

安装 Dovecot：
```bash
sudo apt install dovecot-core dovecot-imapd dovecot-lmtpd dovecot-pgsql
```

配置 Dovecot：
编辑 `/etc/dovecot/dovecot.conf` 文件，添加或修改以下内容：
```bash
protocols = imap lmtp
```

编辑 `/etc/dovecot/conf.d/10-mail.conf` 文件，添加或修改以下内容：
```bash
mail_location = maildir:/var/vmail/%d/%n
```

编辑 `/etc/dovecot/conf.d/10-auth.conf` 文件，添加或修改以下内容：
```bash
auth_mechanisms = plain login
!include auth-sql.conf.ext
```

编辑 `/etc/dovecot/conf.d/auth-sql.conf.ext` 文件，添加或修改以下内容：
```bash
passdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}

userdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}
```

创建 `/etc/dovecot/dovecot-sql.conf.ext` 文件，内容如下：
```bash
driver = pgsql
connect = host=localhost dbname=postfix user=postfix password=your_postfix_password
default_pass_scheme = SHA512-CRYPT
password_query = SELECT username AS user, password FROM mailbox WHERE username = '%u'
user_query = SELECT maildir, 2000 AS uid, 2000 AS gid FROM mailbox WHERE username = '%u'
```

### 5. 配置 PostgreSQL 数据库

创建数据库和用户：
```sql
CREATE DATABASE postfix;
CREATE USER postfix WITH PASSWORD 'your_postfix_password';
GRANT ALL PRIVILEGES ON DATABASE postfix TO postfix;
```

创建表结构：
```sql
CREATE TABLE domain (
    domain VARCHAR(255) NOT NULL,
    PRIMARY KEY (domain)
);

CREATE TABLE mailbox (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    maildir VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    PRIMARY KEY (username),
    FOREIGN KEY (domain) REFERENCES domain(domain)
);

CREATE TABLE alias (
    address VARCHAR(255) NOT NULL,
    goto VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    PRIMARY KEY (address),
    FOREIGN KEY (domain) REFERENCES domain(domain)
);
```

### 6. 配置 Nginx 和 Web 界面

安装 Nginx：
```bash
sudo apt install nginx
```

配置 Nginx：
编辑 `/etc/nginx/sites-available/default` 文件，添加或修改以下内容：
```nginx
server {
    listen 80;
    server_name mail.xnscu.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

重启 Nginx：
```bash
sudo systemctl restart nginx
```

### 7. 创建 Web 界面

你可以使用 Python 的 Flask 或 Node.js 的 Express 来创建一个简单的 Web 界面来查看和管理邮件。

#### 使用 Flask 示例：

安装 Flask：
```bash
pip install flask psycopg2
```

创建 `app.py` 文件：
```python
from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(dbname='postfix', user='postfix', password='your_postfix_password', host='localhost')
    return conn

@app.route('/emails', methods=['GET'])
def get_emails():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM mailbox;')
    emails = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(emails)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

运行 Flask 应用：
```bash
python app.py
```

### 8. 配置邮件转发

编辑 Postfix 配置文件 `/etc/postfix/main.cf`，添加以下内容：
```bash
sender_bcc_maps = hash:/etc/postfix/sender_bcc
```

创建 `/etc/postfix/sender_bcc` 文件，内容如下：
```bash
@xnscu.com xnscu@qq.com
```

生成哈希文件并重启 Postfix：
```bash
sudo postmap /etc/postfix/sender_bcc
sudo systemctl restart postfix
```

### 9. 测试和验证

发送和接收邮件，确保邮件能够正确存储在 PostgreSQL 数据库中，并通过 Web 界面查看邮件数据。

通过这些步骤，你可以搭建一个功能齐全的邮件服务器，并将邮件信息存储在 PostgreSQL 数据库中，同时通过 HTTP 方式查看和管理邮件数据。

## 配置DNS详解
### 配置 DKIM 记录

DKIM（DomainKeys Identified Mail）是一种电子邮件验证方法，用于检测电子邮件中的伪造和篡改行为。以下是配置 DKIM 记录的步骤：

1. **生成 DKIM 密钥对**：
   - 使用工具生成一对公钥和私钥。可以使用 `opendkim-genkey` 工具生成：
     ```bash
     opendkim-genkey -t -s default -d xnscu.com
     ```
     这将生成两个文件：`default.private`（私钥）和 `default.txt`（包含公钥的 DNS 记录）。

2. **配置 DNS 记录**：
   - 登录到你的 DNS 提供商的管理控制台。
   - 添加一个 TXT 记录，内容如下：
     - **主机记录**：`default._domainkey`
     - **记录类型**：TXT
     - **记录值**：从 `default.txt` 文件中复制内容，例如：
       ```
       v=DKIM1; k=rsa; p=公钥内容
       ```

3. **配置邮件服务器**：
   - 将生成的私钥文件 `default.private` 放置在邮件服务器上，并配置邮件服务器使用该私钥进行签名。
   - 对于 Postfix 和 OpenDKIM 的配置，编辑 `/etc/opendkim.conf` 文件，添加以下内容：
     ```conf
     Domain                  xnscu.com
     KeyFile                 /path/to/default.private
     Selector                default
     ```
   - 编辑 Postfix 配置文件 `/etc/postfix/main.cf`，添加以下内容：
     ```conf
     milter_default_action = accept
     milter_protocol = 6
     smtpd_milters = inet:localhost:8891
     non_smtpd_milters = inet:localhost:8891
     ```

4. **重启服务**：
   - 重启 OpenDKIM 和 Postfix 服务：
     ```bash
     sudo systemctl restart opendkim
     sudo systemctl restart postfix
     ```

### 配置 DMARC 记录

DMARC（Domain-based Message Authentication, Reporting & Conformance）是一种电子邮件验证协议，用于防止电子邮件欺诈。以下是配置 DMARC 记录的步骤：

1. **确保已配置 SPF 和 DKIM**：
   - 在配置 DMARC 之前，确保已经正确配置了 SPF 和 DKIM 记录。

2. **配置 DNS 记录**：
   - 登录到你的 DNS 提供商的管理控制台。
   - 添加一个 TXT 记录，内容如下：
     - **主机记录**：`_dmarc`
     - **记录类型**：TXT
     - **记录值**：例如：
       ```
       v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@xnscu.com; ruf=mailto:dmarc-failures@xnscu.com; sp=none; adkim=s; aspf=s
       ```
     - 解释：
       - `v=DMARC1`：指定 DMARC 版本。
       - `p=quarantine`：对未通过 DMARC 验证的邮件进行隔离。
       - `rua=mailto:dmarc-reports@xnscu.com`：接收聚合报告的邮箱地址。
       - `ruf=mailto:dmarc-failures@xnscu.com`：接收失败报告的邮箱地址。
       - `sp=none`：对子域名不应用 DMARC 策略。
       - `adkim=s`：DKIM 对齐模式为严格。
       - `aspf=s`：SPF 对齐模式为严格。

### 验证配置

1. **验证 DKIM**：
   - 发送一封测试邮件到支持 DKIM 验证的邮箱（如 Gmail）。
   - 检查邮件头部，确认包含 `DKIM-Signature` 字段，并且验证通过。

2. **验证 DMARC**：
   - 发送邮件到支持 DMARC 验证的邮箱。
   - 检查 DMARC 报告，确认邮件通过 DMARC 验证。

通过以上步骤，你可以配置 DKIM 和 DMARC 记录，确保邮件的安全性和可信度。

