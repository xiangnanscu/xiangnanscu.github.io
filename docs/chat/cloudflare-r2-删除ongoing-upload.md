# cloudflare r2 删除ongoing upload 
## 概述
https://developers.cloudflare.com/r2/api/s3/api/#implemented-object-level-operations
## 设置环境变量
```ini
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT_URL=https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com
R2_BUCKET=
```
## 安装aws命令行
```sh
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
apt-get install jq
```

## 配置并列举
```sh
aws configure set aws_access_key_id $R2_ACCESS_KEY_ID
aws configure set aws_secret_access_key $R2_SECRET_ACCESS_KEY
aws configure set default.s3.endpoint_url $R2_ENDPOINT_URL
aws s3api list-multipart-uploads --bucket $R2_BUCKET --endpoint-url $R2_ENDPOINT_URL
aws s3api list-multipart-uploads --bucket $R2_BUCKET --endpoint-url $R2_ENDPOINT_URL  | jq -r '.Uploads[] | "--key \"\(.Key)\" --upload-id \(.UploadId)"' | while read -r line; do eval "aws s3api abort-multipart-upload --bucket $R2_BUCKET $line --endpoint-url $R2_ENDPOINT_URL"; done
```

## 计算bucket总大小
```sh
#!/bin/bash

R2_ACCOUNT_ID=xx
R2_ENDPOINT_URL=https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com
R2_BUCKET=bmbk
# 使用aws s3api命令获取对象列表并通过jq计算总大小
total_size_bytes=$(aws s3api list-objects --bucket $R2_BUCKET --endpoint-url $R2_ENDPOINT_URL | \
  jq '[.Contents[].Size] | add // 0')

# 将字节转换为GB
total_size_gb=$(echo "scale=2; $total_size_bytes / (1000 * 1000 * 1000)" | bc)

echo "所有对象的总大小为: ${total_size_gb} GB"
```
