# DNS服务器 #

## 环境依赖 ##

- Redis服务需要开启（或开机启动）

## 部署服务的目录结构 ##

部署服务需要的目录结构如下：

- **config：**服务的配置目录。
- **dns：**服务的软链接目录。
- **release：**版本发布目录。

**建议：**可以部署在目标服务器的`/home/localad/dns-server`目录下。

## 服务部署的方法 ##

### 克隆和部署 ###

使用GIT克隆项目代码：

	cd /home/localad/dns-server/release
	git clone https://github.com/localad/dns-server.git dns-server-{版本号} -b {版本号}

### 建立软连接 ###

	rm -rf /home/localad/dns-server/dns
	ln -s /home/localad/dns-server/release/dns-server-{版本号} /home/localad/dns-server/dns

第一次部署时，需要复制系统配置文件，并设置：

	cp -r /home/localad/dns-server/release/dns-server-{版本号}/config /home/localad/dns-server

### 启动和停止服务 ###

进入`dns/bin`目录，可以使用以下命令：

- `sh ./server-install.sh`：安装NPM依赖
- `sh ./dns-server.sh start`：启动
- `sh ./dns-server.sh stop`：停止
- `sh ./dns-server.sh restart`：重启

## 关于DNS ##

### 公共DNS ###

- CNNIC SDNS：`1.2.4.8` `210.2.4.8`
- [阿里公共DNS](http://www.alidns.com/)：`223.5.5.5` `223.6.6.6`
- 114 DNS：`114.114.114.114` `114.114.115.115`
- Google DNS：`8.8.8.8` `8.8.4.4`

### 服务器DNS的配置 ###

本机的DNS配置信息是在：`/etc/resolv.conf`

### 刷新DNS缓存 ###

- 进入命令提示符下（开始——运行——cmd）
- 运行：`ipconfig /displaydns`命令，查看本机已经缓存了哪些dns信息
- 输入 `ipconfig /flushdns` 命令清空本机的dns缓存信息
- 再次输入 `ipconfig /displaydns` 命令查看一下

## 参考文档 ##

- [如何刷新DNS缓存](http://blog.csdn.net/zhongguoren666/article/details/7597675)
- [全国 DNS 服务器](http://www.ip.cn/dns.html)
- [全国内外公共DNS服务器地址分享](http://www.orsoon.com/news/pcnews/15733.html)
