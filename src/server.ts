import express = require("express");
import fs = require("fs");
import fcm = require("firebase-admin");
import admin from "./admin/adminrouter";
import person from "./api/person";
import user from "./api/user";
import mark from "./api/mark";
import avatar from "./api/avatar";
import fileupload from "./api/fileupload";
import vr_info from "./api/vr_info";
import JWTLogin from "./admin/JWTLogin";
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
const serverset = JSON.parse(fs.readFileSync("bin/server.json", "utf-8"));

//fcm 구성 설정 불러오기
fcm.initializeApp({ credential: fcm.credential.cert(serverset.fcmkey) });

server.get("/", (req, res) => {
    res.send("서버가 작동중");
});

server.get("/api", (req, res) => {
    //github readme 페이지로 이동
    res.redirect("https://github.com/MARS-19th/mars_backend_api/blob/main/README.md");
});

server.listen(serverset.port, () => {
    console.log(`서버가 ${serverset.port}포트로 열림`);
});

// 같은 객체 타입확인
function sameobj(obj1: {}, obj2: {}): boolean {
    return (
        JSON.stringify(Object.keys(obj1).sort()) ===
        JSON.stringify(Object.keys(obj2).sort())
    );
}

interface TypedRequestBody<T> extends Express.Request {
    body: T /* body 타입 제공 */;
}

export { serverset, TypedRequestBody, sameobj, fcm };
