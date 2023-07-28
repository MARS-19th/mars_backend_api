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

// 같은 타입(얼굴, 몸...)에 해당하는 아바타 아이디, 파일 경로 리턴 (타입): err or results: [{아이디, 경로}]
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
    const query = `select element1, element2, element3, element4, shop_element1 from User_avatar where user_name = "${req.params.name}";`;

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

// 유저 아바타 설정 (이름, 객체1 id, 객체2 id, 객체3 id, 객체 4 id): err or ok
// 추후 요소명 수정
type setuseravatar = {
    user_name: string;
    element1: number | null;
    element2: number | null;
    element3: number | null;
    element4: number | null;
};
const setuseravatar = {
    user_name: "string",
    element1: "int 또는 null",
    element2: "int 또는 null",
    element3: "int 또는 null",
    element4: "int 또는 null",
};
avatar.post("/avatar/setuseravatar", (req: TypedRequestBody<setuseravatar>, res) => {
    if (!sameobj(setuseravatar, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuseravatar });
        return;
    }
    const query = `insert into User_avatar (user_name, element1, element2, element3, element4) 
    values ("${req.body.user_name}", ${req.body.element1}, ${req.body.element2}, ${req.body.element3}, ${req.body.element4}) on duplicate key update 
    element1 = ${req.body.element1}, 
    element2 = ${req.body.element2},
    element3 = ${req.body.element3},
    element4 = ${req.body.element4};`;

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
