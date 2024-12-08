# 配置SDK和JAVA还有RUST
```sh
#!/bin/bash

# 更新系统包
sudo apt update && sudo apt upgrade -y


# 下载并配置Android SDK
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip -d android-sdk
mkdir -p android-sdk/cmdline-tools/latest
mv android-sdk/cmdline-tools/* android-sdk/cmdline-tools/latest/
rm commandlinetools-linux-11076708_latest.zip

# 设置Android SDK环境变量
echo "export ANDROID_HOME=$HOME/android-sdk" >> ~/.bashrc
echo "export PATH=\$ANDROID_HOME/cmdline-tools/latest/bin:\$PATH" >> ~/.bashrc
source ~/.bashrc

# 使用sdkmanager安装Android SDK和NDK
yes | sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "platforms;android-30" "build-tools;30.0.3"
yes | sdkmanager --sdk_root=$ANDROID_HOME "ndk;23.1.7779620"

# 安装Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# 为Android添加Rust目标
rustup target add \
    armv7-linux-androideabi \
    aarch64-linux-android \
    i686-linux-android \
    x86_64-linux-android

# 验证安装
java --version
echo "Android SDK location: $ANDROID_HOME"
rustc --version
cargo --version

echo "环境配置完成！可以开始编译shadowsocks-android项目了。"
```
