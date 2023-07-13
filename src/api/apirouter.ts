import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, serverset } from "../server";
const router = express.Router();

router.get("/getuser/:id", (req, res) => {
    const query = `select *from User where id = "${req.params.id}";`;

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
router.post("/setname", (req: TypedRequestBody<sername>, res) => {
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

export default router;
