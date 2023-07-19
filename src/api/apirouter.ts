import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, serverset } from "../server";
const router = express.Router();

router.get("/getlogin/:id", (req, res) => {
    console.log("야");
    
    //회원 이름 => 아이디, 패스워드
    const query = `SELECT id, passwd from User JOIN User_data on User.id = User_data.user_id WHERE User_data.user_name = "${req.params.id}";`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else if (results?.length) {
            res.send(results[0]);
        } else {
            res.status(403).send();
        }
    });

    dbconect.end();
});

type sername = {
    id: string;
    passwd: string;
};
router.post("/setuser", (req: TypedRequestBody<sername>, res) => {
    const query = `insert into User values('${req.body.id}', '${req.body.passwd}');`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.log(err);
            res.status(403).send();
        } else {
            res.send();
        }
    });

    dbconect.end();
});

type delname = {
    id: string;
};
router.post("/deluser", (req: TypedRequestBody<delname>, res) => {
    const query = `DELETE from User WHERE id = "${req.body.id}"`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.log(err);
            res.status(403).send();
        } else {
            res.send();
        }
    });

    dbconect.end();
});

export default router;
