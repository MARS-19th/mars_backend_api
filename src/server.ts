import express = require("express");
import fs = require("fs");
import adminrouter from "./admin/adminrouter";
import apirouter from "./api/apirouter";
const server = express();

const json = JSON.parse(fs.readFileSync("server.json", "utf-8"));

const conn = {
    host: json.dbhost,
    port: json.dbport,
    user: json.dbuser,
    password: json.dbpassword,
    database: "mars",
};

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/admin", adminrouter); //관리자 페이지 라우팅
server.use("/api", apirouter); //api 라우팅

server.listen(json.port, () => {
    console.log(`서버가 ${json.port}포트로 열림`);
});

interface TypedRequestBody<T> extends Express.Request {
    body: T /* body 타입 제공 */;
}

export { conn, TypedRequestBody };
