/* 회원 정보 구성요소 */
import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, sameobj, serverset } from "../server";
const person = express.Router();

//처음 회원 가입 (아이디, 비번): err or ok
type sername = {
    id: string; // 아이디
    passwd: string; // 비번
};
const sername = {
    id: "string",
    passwd: "string",
};
person.post("/setperson", (req: TypedRequestBody<sername>, res) => {
    if (!sameobj(sername, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: sername });
        return;
    }

    const query = `insert into User values('${req.body.id}', '${req.body.passwd}');`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code }); // ER_DUP_ENTRY = 중복 발생함
        } else {
            res.json({ results: true });
        }
    });

    dbconect.end();
});

//탈퇴 (아이디, 비밀번호): err or ok
type delname = {
    id: string; //사용자 이름
    passwd: string;
};
const delname = {
    id: "string",
    passwd: "string",
};
person.post("/deluser", (req: TypedRequestBody<delname>, res) => {
    if (!sameobj(delname, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: delname });
        return;
    }

    const query = `delete from User where id = "${req.body.id}" && passwd = "${req.body.passwd}";`;

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

//로그인 (아이디, 비번): err or 모든user_data
type login = {
    id: string; // 아이디
    passwd: string; // 비번
};
const login = {
    id: "string",
    passwd: "string",
};
person.post("/login", (req: TypedRequestBody<login>, res) => {
    if (!sameobj(login, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: login });
        return;
    }

    const query = `select User_data.* from User 
    left outer join User_data on User.id = User_data.user_id
    where User.id = "${req.body.id}" && User.passwd ="${req.body.passwd}";`;

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
            } else if (!results[0].user_name) {
                console.log("신규유저");
                res.status(500).json({ err: "is_new" });
            } else {
                res.json(results[0]);
            }
        }
    });

    dbconect.end();
});

// 유저 아이디 비밀번호 얻기 (닉네임): id, passwd or err
type getuseridpd = {
    user_name: string; // 유저 닉네임
};
const getuseridpd = {
    user_name: "string",
};
person.post("/getuseridpd", (req: TypedRequestBody<getuseridpd>, res) => {
    if (!sameobj(getuseridpd, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: getuseridpd });
        return;
    }

    const query = `select User.id, User.passwd from User join User_data on User.id = User_data.user_id
    where User_data.user_name = "${req.body.user_name}";`;

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

export default person;
