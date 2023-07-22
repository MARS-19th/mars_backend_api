import express = require("express");
import fs = require("fs");
import adminrouter from "./admin/adminrouter";
import apirouter from "./api/apirouter";
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/admin", adminrouter); //관리자 페이지 라우팅
server.use("/api", apirouter); //api 라우팅

const serverset = JSON.parse(fs.readFileSync("server.json", "utf-8"));

server.listen(serverset.port, () => {
    console.log("테스트");
    console.log(`서버가 ${serverset.port}포트로 열림`);
});

interface TypedRequestBody<T> extends Express.Request {
    body: T /* body 타입 제공 */;
}

export { serverset, TypedRequestBody };
