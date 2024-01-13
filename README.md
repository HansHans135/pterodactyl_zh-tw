# pterodactyl_zh-tw
Pterodactyl繁體中文化

# 說明
此翻譯大部分皆使用機器翻譯，若有不準確歡迎幫忙修改

# 使用
## 先決條件
```sh
#安裝node.js16
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

#安裝yarn
npm i -g yarn
```
## 安裝
```sh
#切換至面板位置(通常安裝在/var/www/pterodactyl)
cd /var/www/pterodactyl
yarn

#切換至面板位置(面板通常安裝在/var/www/pterodactyl)
cd ./resources/scripts

#下載翻譯檔
wget https://raw.githubusercontent.com/HansHans135/pterodactyl_zh-tw/main/package/1.11.5.zip

#解壓縮並覆蓋
unzip -o 1.11.5.zip

#構建
yarn build:production
```
# 關於
- 目前只支援1.11.5版
- 遵守 MIT License

我的discord群組: https://discord.gg/JayWx9RygN