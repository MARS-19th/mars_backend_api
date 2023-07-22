#리눅스 서버 실행용
git pull
npm install
npx tsc
rsync -av --exclude '*.ts' ./src/ ./build/
sudo node build/server.js