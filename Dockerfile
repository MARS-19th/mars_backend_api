FROM node:lts

# bash 로 번경
SHELL [ "/bin/bash", "-c" ]

# 패키지 업글 & rsync 설치
RUN apt update && apt upgrade -y && apt install -y rsync

# node 계정 지우고 mars 계정 추가
RUN userdel -rf node; \ 
adduser --disabled-password mars

# 사용자 홈으로 설정
WORKDIR "/home/mars"

# 프로젝트 clone
RUN git clone https://github.com/MARS-19th/mars_backend_api.git
WORKDIR "/home/mars/mars_backend_api"

#실행 할때 처음 실행 여부 판단하여 필요파일 생성
CMD \
if ! [ -f  ./.initfile ]; then \
    echo "$SERVER_JSON" > ./src/server.json; \
    echo "$DB_SSH" > ./src/dbssh/dbssh.pem; \
    chmod +x start.sh; \
    touch ./.initfile; \
fi; \
./start.sh