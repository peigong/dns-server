#!/bin/sh

ACTION=$1

#help
usage(){
    echo "Usage: sh ./dns-server.sh {start|stop|restart}"
    exit 1;
}

#start server
start(){
    forever start ../server/server.js
}

#stop server
stop(){
    forever stop ../server/server.js
}

restart(){
    forever restart ../server/server.js
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