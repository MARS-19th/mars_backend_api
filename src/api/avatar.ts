/* 아바타 커스텀/상점 */
import express = require("express");
import mysql = require("mysql");
import fs = require("fs");
import path = require("path");
import { TypedRequestBody, sameobj, serverset } from "../server";
const avatar = express.Router();
const savepath = path.join(__dirname, "../res");

// 유저의 아바타 객체들 불러오기 (이름): err or {look, color}
avatar.get("/getuseravatar/:name", (req, res) => {
    const query = `select look, color from User_avatar where user_name = "${req.params.name}";`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            if (!results?.length) {
                console.error("항목없음");
                res.status(500).json({ err: "empty" });
            } else {
                res.json(results[0]);
            }
        }
    });

    dbconect.end();
});

// 유저 아바타 설정 (이름, 표정을 식별하는 데이터, 색상을 식별하는 데이터): err or ok
type setuseravatar = {
    user_name: string;
    look: string;
    color: string;
};
const setuseravatar = {
    user_name: "string",
    look: "string",
    color: "string",
};
avatar.post("/setuseravatar", (req: TypedRequestBody<setuseravatar>, res) => {
    if (!sameobj(setuseravatar, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuseravatar });
        return;
    }
    const query = `insert into User_avatar (user_name, look, color) 
    values ("${req.body.user_name}", "${req.body.look}", "${req.body.color}") on duplicate key update 
    look = "${req.body.look}", 
    color = "${req.body.color}";`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: true });
        }
    });

    dbconect.end();
});

export default avatar;
