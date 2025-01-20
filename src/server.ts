import express = require("express");
import fs = require("fs");
import fcm = require("firebase-admin");
import ssh = require("ssh2");
import admin from "./admin/adminrouter";
import person from "./api/person";
import user from "./api/user";
import mark from "./api/mark";
import avatar from "./api/avatar";
import fileupload from "./api/fileupload";
import vr_info from "./api/vr_info";
import JWTLogin from "./admin/JWTLogin";
import serverset from "./server.json";
import net = require("net");
import path = require("path");
import { CreateDBConnection } from "./DBConnection";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/admin", admin); //관리자 페이지 라우팅
server.use("/admin", JWTLogin); //관리자 페이지 jwt 로그인
server.use("/api", person); // 가입부분
server.use("/api", user); // 유저 부분
server.use("/api", mark); // 목표&스킬트리 부분
server.use("/api", avatar); // 아바타/상점 부분
server.use("/api", fileupload); // 프로필 사진 업로드/다운로드 구현
server.use("/api", vr_info); // vr에 필요한 데이터

//실행시 프로젝트 파일에서 실행함으로 상대경로 적용

//fcm 구성 설정 불러오기
fcm.initializeApp({ credential: fcm.credential.cert(serverset.fcmkey as fcm.ServiceAccount) });

server.get("/", (req, res) => {
    res.send("서버가 작동중");
});

server.get("/api", (req, res) => {
    //github readme 페이지로 이동
    res.redirect("https://github.com/MARS-19th/mars_backend_api/blob/main/README.md");
});

// 같은 객체 타입확인
function sameobj(obj1: {}, obj2: {}): boolean {
    return JSON.stringify(Object.keys(obj1).sort()) === JSON.stringify(Object.keys(obj2).sort());
}

interface TypedRequestBody<T> extends Express.Request {
    body: T /* body 타입 제공 */;
}

// SSH 터널 생생
let sshStream: ssh.ClientChannel | undefined;
const sshClient = new ssh.Client();
sshClient
    .on("ready", () => {
        sshClient.forwardOut(
            "localhost",
            0,
            serverset.setdb.host,
            serverset.sshtunnel.innerPort,
            async (err, stream) => {
                if (err) {
                    console.log("ssh 포워딩 실패");
                    sshClient.end();
                    return;
                }
                sshStream = stream;

                let bridgeSocket: net.Socket;
                sshStream.addListener("data", async (data) => {
                    if (!bridgeSocket) {
                        bridgeSocket = await bridgeServer;
                    }
                    bridgeSocket.write(data);
                });

                CreateDBConnection(serverset.setdb);

                // 서버 실행
                server.listen(serverset.port, "0.0.0.0", () => {
                    console.log(`서버가 ${serverset.port}포트로 열림`);
                });
            }
        );
    })
    .connect({
        ...serverset.sshtunnel,
        privateKey: fs.readFileSync(path.join(__dirname, serverset.sshtunnel.privateKeyPath)),
    });

// SSH 터널쪽 브릿지 서버 생성 (자체 포트 전달이 안되므로)
const bridgeServer = new Promise<net.Socket>((resolve, reject) => {
    const server = net.createServer((socket) => {
        resolve(socket);

        socket.on("close", () => {
            console.log("close");
        });
        socket.on("data", (data) => {
            sshStream?.write(data);
        });
        socket.on("end", () => {
            console.log("end");
        });
        socket.on("error", (err) => {
            console.log(`err: ${err}`);
        });
    });
    server.listen(serverset.sshtunnel.forwardPort);
});

export { TypedRequestBody, sameobj, fcm };
