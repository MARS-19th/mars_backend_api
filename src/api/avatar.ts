/* 아바타 커스텀/상점 */
import express = require("express");
import mysql = require("mysql");
import fs = require("fs");
import path = require("path");
import { TypedRequestBody, sameobj, serverset } from "../server";
const avatar = express.Router();
const savepath = path.join(__dirname, "../res");

// 아바타 아이템 파일 경로 리턴 (아이템 아이디): 파일경로
avatar.get("/avatar/getitem/:id", (req, res) => {
    const query = `select local from Avatar_item where object_id = ${req.params.id};`;

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
                res.json({results: results[0].local});
            }
        }
    });

    dbconect.end();
});

// 같은 타입(표정, 색상)에 해당하는 아바타 아이디, 파일 경로 리턴 (타입): err or results: [{아이디, 경로}]
avatar.get("/avatar/getid/:type", (req, res) => {
    const query = `select object_id, local from Avatar_item where type = "${req.params.type}";`;

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
                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// 유저의 아바타 객체들 불러오기 (이름): err or element1, element12 ...
avatar.get("/avatar/getuseravatar/:name", (req, res) => {
    const query = `select look, color, shop_element1 from User_avatar where user_name = "${req.params.name}";`;

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

// 유저 아바타 설정 (이름, 표정객체 id, 색상id): err or ok
type setuseravatar = {
    user_name: string;
    look: number;
    color: number;
};
const setuseravatar = {
    user_name: "string",
    look: "int",
    color: "int",
};
avatar.post("/avatar/setuseravatar", (req: TypedRequestBody<setuseravatar>, res) => {
    if (!sameobj(setuseravatar, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuseravatar });
        return;
    }
    const query = `insert into User_avatar (user_name, look, color) 
    values ("${req.body.user_name}", ${req.body.look}, ${req.body.color}) on duplicate key update 
    look = ${req.body.look}, 
    color = ${req.body.color};`;

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
