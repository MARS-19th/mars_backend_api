/* 목표/스킬트리 */
import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, serverset } from "../server";
const mark = express.Router();

// 모든 목표 리턴 (): [mark, type]
mark.get("/getmark", (req, res) => {
    const query = `select mark, type from Mark_list order by type;`;

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
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 세부 목록 리턴 스킬명(css): [mark_list, target_mark, level=주차]
mark.get("/getdetailmark/:skill", (req, res) => {
    const query = `select mark_list, target_mark, level from Details_mark 
    where skill_field = "${req.params.skill}" 
    order by target_mark, level;`;

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
                res.json(results);
            }
        }
    });

    dbconect.end();
});

//유저 선택 스킬트리 (닉네임): skills: [...스킬들]
mark.get("/userskill/:name", (req, res) => {
    const query = `select skill_field from User_skill where user_name = "${req.params.name}";`;

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
                results = results.map((line) => {
                    return line.skill_field;
                });

                res.json({results});
            }
        }
    });

    dbconect.end();
});

//사용자 목표 현황 (yyyy-mm-dd, 닉네임, 스킬(css)): mark_list, progress
mark.get("/userskill/:date/:name/:skill", (req, res) => {
    const query = `select mark_list, progress from User_mark where 
    date = "${req.params.date}" && 
    user_name = "${req.params.name}" && 
    skill_field = "${req.params.skill}";`;

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
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 사용자 진행 목표 설정 (닉네임, 스킬명, 세부목표, 진행도): err: ER_DUP_ENTRY or ok
// 사용자가 처음 목표 진행시 거쳐야 함
type setuserskill = {
    user_name: string; // 닉네임
    skill: string; // 스킬명 (css, js)
    mark_list: string; // 세부목표
    progress: number; // 진행도
};
const setuserskill = {
    user_name: "string",
    skill: "string",
    mark_list: "string",
    progress: "int",
};
mark.post("/setuserskill", (req: TypedRequestBody<setuserskill>, res) => {
    for (const key in req.body) {
        if (!Object.keys(setuserskill).includes(key)) {
            console.error("값이 잘못넘어옴");            
            res.status(500).json({ err: "type_err", type: setuserskill });
            return;
        }
    }

    const query = `delete from User_mark where 
    user_name = "${req.body.user_name}" && 
    skill_field = "${req.body.skill}" && 
    mark_list = "${req.body.mark_list}";
    insert into User_mark (user_name, skill_field, mark_list, progress) values 
    ("${req.body.user_name}", "${req.body.skill}", "${req.body.mark_list}", ${req.body.progress});`;

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

export default mark;
