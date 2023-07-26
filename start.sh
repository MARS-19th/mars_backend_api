#리눅스 서버 실행용
git pull
npm install
npx tsc
rsync -av --exclude '*.ts' ./src/ ./bin/
sudo node bin/server.js