import express = require("express");
import fs = require("fs");
import adminrouter from "./admin/adminrouter";
import person from "./api/person";
import user from "./api/user";
import mark from "./api/mark";
import avatar from "./api/avatar";
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/admin", adminrouter); //관리자 페이지 라우팅
server.use("/api", person); // 가입부분
server.use("/api", user); // 유저 부분
server.use("/api", mark); // 목표&스킬트리 부분
server.use("/api", avatar); // 아바타/상점 부분

const serverset = JSON.parse(fs.readFileSync("server.json", "utf-8"));

server.listen(serverset.port, () => {
    console.log(`서버가 ${serverset.port}포트로 열림`);
});

// 같은 객체 타입확인
function sameobj(obj1: {}, obj2: {}): boolean {
    return (
        JSON.stringify(Object.keys(obj1)) === JSON.stringify(Object.keys(obj2))
    );
}

interface TypedRequestBody<T> extends Express.Request {
    body: T /* body 타입 제공 */;
}

export { serverset, TypedRequestBody, sameobj };
