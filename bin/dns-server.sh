#!/bin/sh

ACTION=$1

#help
usage(){
    echo "Usage: sh ./dns-server.sh {start|stop|restart}"
    exit 1;
}

#start server
start(){
    pm2 start pm2.json
}

#stop server
stop(){
    pm2 stop pm2.json
}

restart(){
    pm2 restart pm2.json
}

case "$ACTION" in
    start )
        start
        ;;
    stop )
        stop
        ;;
    restart )
        restart
        ;;
    *)
        usage
esac