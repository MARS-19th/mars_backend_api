import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, sameobj, serverset } from "../server";
const avatar = express.Router();

// 아바타 아이템 파일 리턴 (아이템 아이디): file
// 안드로이드에서 네트워크로 리소스 불러올수 있게
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
                res.sendFile(__dirname + results[0].local);
            }
        }
    });

    dbconect.end();
});

// 같은 타입(얼굴, 몸...)에 해당하는 아바타 아이디 리턴 (타입): err or results: [...아이디]
// 아바타 생성시 타입을 넘어 갈때마다 요청
avatar.get("/avatar/getid/:type", (req, res) => {
    const query = `select object_id from Avatar_item where type = "${req.params.type}";`;

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
                results = results?.map((line) => {
                    return line.object_id;
                });
                res.json({results});
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
    element1: string | null;
    element2: string | null;
    element3: string | null;
    element4: string | null;
};
const setuseravatar = {
    user_name: "string",
    element1: "string 또는 null",
    element2: "string 또는 null",
    element3: "string 또는 null",
    element4: "string 또는 null",
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
