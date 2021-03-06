# DNS服务器 #

## 环境依赖 ##

- Redis服务需要开启，最好设置为开机启动。
- linux系统需要在防火墙规则中内加入UDP和TCP端口53的外网访问，windows系统需要在防火墙里添加端口，选择UDP，输入端口号53，如果使用服务器安全狗等防火墙，请添加53端口在UDP的完全访问，例外中去掉127.0.0.1即可。参考：《[DNS端口号](http://baike.baidu.com/view/3385138.htm?fr=aladdin)》

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
- `sh ./dns-server.sh stop`：停止【暂时不能使用】
- `sh ./dns-server.sh restart`：重启【暂时不能使用】

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

### 配置本机DNS ###

在CentOS5.4下面直接修改/etc/resolv.conf不行。

必须要在/etc /sysconfig/network-scripts/ifcfg-eth0里面最后加上dns的设置。要不然，重启后，肯定使用eth0设置中没有设 dns的相关信息，使/etc/resolv.conf恢复到原来的状态。

打开/etc/sysconfig/network-scripts/ifcfg-eth0，为了保险起见，可以同样修改eth1的设置

### 域控和DNS ###

- [动态DNS](http://baike.baidu.com/view/1296340.htm?fr=aladdin)
- [辅助域控及dns设置](http://wenku.baidu.com/link?url=0VPHYKjbsHAl3GNRYV1kbaPNXz3xANnImMZkOl9ZfpD_SFmoMt-_wxUmslc0beJp2T3i_-x3OhJXjU1SBOtLfSDSu85rqmKSY9ch3umAixK)
- [DC和DNS分离安装](http://windows56.blog.163.com/blog/static/181807598201182893739911/)

## 参考文档 ##

- [如何刷新DNS缓存](http://blog.csdn.net/zhongguoren666/article/details/7597675)
- [全国 DNS 服务器](http://www.ip.cn/dns.html)
- [全国内外公共DNS服务器地址分享](http://www.orsoon.com/news/pcnews/15733.html)
