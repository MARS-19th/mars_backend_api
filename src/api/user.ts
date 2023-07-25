import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, serverset } from "../server";
const user = express.Router();

//회원 모든 정보 조회 (유저이름): err or 모든 유저 정보
user.get("/getuserdata/:name", (req, res) => {
    const query = `select *from User_data where user_name = "${req.params.name}";`;

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

// 회원 블루투스 mac 리턴 (유저이름): err or bt_mac
user.get("/getbtmac/:name", (req, res) => {
    const query = `select bt_mac from User_bluetooth where user_name = "${req.params.name}";`;

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

// 모든 회원 정보 추가 (닉네임, 아이디, 목표, 프사경로): ok or err
type setuser = {
    user_name: string;
    user_id: string;
    choice_mark: string;
    profile_local: string;
};
const setuser = {
    user_name: "string",
    user_id: "string",
    choice_mark: "string",
    profile_local: "string",
};
user.post("/setuser", (req: TypedRequestBody<setuser>, res) => {
    for (const key in req.body) {
        if (!Object.keys(setuser).includes(key)) {
            console.error("값이 잘못넘어옴");
            res.status(500).json({ err: "type_err", type: setuser });
            return;
        }
    }

    const query = `insert into User_data(user_name, user_id, choice_mark, profile_local) values 
    ("${req.body.user_name}", "${req.body.user_id}", "${req.body.choice_mark}", "${req.body.profile_local}");`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code }); // ER_DUP_ENTRY = 중복 발생함
        } else {
            res.send();
        }
    });

    dbconect.end();
});

//닉네임 중복 체크 (닉네임): err or ok
type chname = {
    user_name: string; // 닉네임
};
const chname = {
    user_name: "string",
};
user.post("/login", (req: TypedRequestBody<chname>, res) => {
    for (const key in req.body) {
        if (!Object.keys(chname).includes(key)) {
            console.error("값이 잘못넘어옴");
            res.status(500).json({ err: "type_err", type: chname });
            return;
        }
    }

    const query = `select user_name from User_data where user_name = "${req.body.user_name}";`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            if (results?.length) {
                console.error("중복발견");
                res.status(500).json({ ok: false });
            } else {
                res.json({ ok: true });
            }
        }
    });

    dbconect.end();
});

//블루투스 mac 설정 (닉네임, mac 주소): err or ok
type setbt = {
    user_name: string;
    bt_mac: string;
};
const setbt = {
    user_name: "string",
    bt_mac: "string",
};
user.post("/setbtmac", (req: TypedRequestBody<setbt>, res) => {
    for (const key in req.body) {
        if (!Object.keys(setbt).includes(key)) {
            console.error("값이 잘못넘어옴");
            res.status(500).json({ err: "type_err", type: setbt });
            return;
        }
    }

    const query = 
    `delete from User_data where user_id = "${req.body.user_name}";
    insert into User_bluetooth values("${req.body.user_name}", "${req.body.bt_mac}");`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.send();
        }
    });

    dbconect.end();
});

export default user;
