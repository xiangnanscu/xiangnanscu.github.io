const n=`https://help.aliyun.com/zh/simple-application-server/use-cases/use-vnc-to-build-guis-on-ubuntu-18-04-and-20-04?spm=5176.2020520104.0.0.29c43f1bhFrq7c#21e0b772d7fgc

\`\`\`sh
apt-get update
apt install -y gnome-panel gnome-settings-daemon metacity nautilus gnome-terminal ubuntu-desktop
apt-get install tightvncserver -y
vncserver
cp ~/.vnc/xstartup ~/.vnc/xstartup.bak
vim ~/.vnc/xstartup
vncserver -kill :1
vncserver -geometry 1920x1080 :1
\`\`\`
`;export{n as default};
