# x11vnc

## install

```sh
sudo apt update && sudo apt upgrade -y
sudo apt-get install lightdm -y
sudo reboot
sudo apt-get install x11vnc -y
x11vnc -storepasswd /root/.vnc/passwd
```

## x11vnc.service

```sh
sudo vim /lib/systemd/system/x11vnc.service
```

## file

```
[Unit]
Description=x11vnc service
After=display-manager.service network.target syslog.target

[Service]
Type=simple
ExecStart=/usr/bin/x11vnc -forever -display :0 -auth guess -rfbauth /root/.vnc/passwd
ExecStop=/usr/bin/killall x11vnc
Restart=on-failure

[Install]
WantedBy=multi-user.target

```

## take effect

```sh
systemctl daemon-reload && systemctl enable x11vnc.service && systemctl start x11vnc.service && systemctl status x11vnc.service
```

# TightVNC

## install

```sh
apt-get update
apt install -y gnome-panel gnome-settings-daemon metacity nautilus gnome-terminal ubuntu-desktop
apt-get install tightvncserver -y
vim ~/.vnc/xstartup
```
## xstartup
```sh
#!/bin/sh
export XKL_XMODMAP_DISABLE=1
export XDG_CURRENT_DESKTOP="GNOME-Flashback:GNOME"
export XDG_MENU_PREFIX="gnome-flashback-"
gnome-session --session=gnome-flashback-metacity --disable-acceleration-check &
```
## add service
```sh
vim /etc/systemd/system/vncserver.service
```
## vncserver.service
```
[Unit]
Description=TightVNC server
After=syslog.target network.target

[Service]
Type=forking
User=root
Group=root
WorkingDirectory=/root

ExecStart=/usr/bin/vncserver -geometry 1920x1080 :1
ExecStop=/usr/bin/vncserver -kill :1

Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

## take effect
```sh
sudo systemctl daemon-reload
sudo systemctl enable vncserver.service
sudo systemctl start vncserver.service
systemctl status vncserver
```

## reference

https://help.aliyun.com/zh/simple-application-server/use-cases/use-vnc-to-build-guis-on-ubuntu-18-04-and-20-04?spm=5176.2020520104.0.0.29c43f1bhFrq7c#21e0b772d7fgc

```sh

vncserver
cp ~/.vnc/xstartup ~/.vnc/xstartup.bak
vim ~/.vnc/xstartup
vncserver -kill :1
vncserver -geometry 1920x1080 :1
```

