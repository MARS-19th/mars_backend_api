/* 목표/스킬트리 */
import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, sameobj, serverset } from "../server";
const mark = express.Router();

// 스킬 트리 리턴 (목표): [스킬트리] or err
mark.get("/getskilltree/:tartget_mark", (req, res) => {
    const query = `select skill_field, skill_level from Skill_Mark 
    where target_mark = "${req.params.tartget_mark}"
    order by skill_level;`;

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

// 스킬명 전체 세부목표 리턴 (스킬명): [{mark_id, mark_list, level}]
mark.get("/getdetailmark/:skill", (req, res) => {
    const query = `select mark_id, mark_list, level from Details_mark 
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
                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// 세부 목록 리턴 스킬명(스킬명/주차): [{mark_id, mark_list}]
mark.get("/getdetailmark/:skill/:level", (req, res) => {
    const query = `select mark_id, mark_list from Details_mark 
    where skill_field = "${req.params.skill}" && level = ${req.params.level}
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
                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// 유저 선택 스킬트리 (닉네임): skills: [...스킬들]
mark.get("/getuserskill/:name", (req, res) => {
    const query = `select skill_field from User_skill where user_name = "${req.params.name}"
    order by clear_time;`;

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

                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// 사용자 목표 현황 (이름/스킬명/주차): [{mark_id, progress, date}]
mark.get("/getusermark/:user_name/:skill/:level", (req, res) => {
    const query = `select Details_mark.mark_id, User_mark.progress, User_mark.date from User_mark 
    join Details_mark on User_mark.mark_id = Details_mark.mark_id
    where User_mark.user_name = "${req.params.user_name}" && 
    Details_mark.skill_field = "${req.params.skill}" && 
    Details_mark.level = ${req.params.level};`;

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

// 세부목표 추가 정보사항 유튜브 링크 같은거(세부목표 id): [추가정보들] or err
mark.get("/getmoredata/:mark_id", (req, res) => {
    const query = `select info_data, type from More_data where mark_id = ${req.params.mark_id};`;

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

// 해당 유저가 추가한 모든 일간목표 클리어 여부 리턴 (이름): [{목표id, 목표들, 클리어 여부, 추가시간}] or err
mark.get("/getuserdatemark/:name", (req, res) => {
    const query = `select mark_id, mark_list, is_clear, add_time from User_date_mark where user_name="${req.params.name}";`;

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
                results.map((line) => {
                    if (line.is_clear === 0) {
                        line.is_clear = false;
                        return line;
                    } else {
                        line.is_clear = true;
                        return line;
                    }
                });

                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// 해당 유저가 추가한 24시간 이내의 일간목표 클리어 여부 리턴 (이름): [{목표id, 목표들, 클리어 여부, 추가시간}] or err0
mark.get("/getuserdatemark/:name/day", (req, res) => {
    const query = `select mark_id, mark_list, is_clear, add_time, 86400-timestampdiff(second, add_time, now()) as remaining 
    from User_date_mark where user_name = "${req.params.name}" && timestampdiff(second, add_time, now()) < 86400;`;

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
                results.map((line) => {
                    if (line.is_clear === 0) {
                        line.is_clear = false;
                        return line;
                    } else {
                        line.is_clear = true;
                        return line;
                    }
                });

                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// 사용자 스킬트리 추가 (닉네임, 스킬명) err or ok
type setuserskill = {
    user_name: string; // 닉네임
    skill: string; // 스킬명
};
const setuserskill = {
    user_name: "string",
    skill: "string"
};
mark.post("/setuserskill", (req: TypedRequestBody<setuserskill>, res) => {
    if (!sameobj(setuserskill, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuserskill });
        return;
    }
    const query = `insert into User_skill (user_name, skill_field) values ("${req.body.user_name}", "${req.body.skill}");`;

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

// 사용자 진행 세부목표 설정 (닉네임, 세부목표id, 진행도): err: ER_DUP_ENTRY or ok
type setuserdetailskill = {
    user_name: string; // 닉네임
    mark_id: number; // 세부 목표 id  
    progress: number; // 진행도
};
const setuserdetailskill = {
    user_name: "string",
    mark_id: "int",
    progress: "int",
};
mark.post("/setuserdetailskill", (req: TypedRequestBody<setuserdetailskill>, res) => {
    if (!sameobj(setuserdetailskill, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuserdetailskill });
        return;
    }
    const query = `insert into User_mark (user_name, mark_id, progress) 
    values ("${req.body.user_name}", "${req.body.mark_id}", "${req.body.progress}") on duplicate key update 
    user_name = "${req.body.user_name}", 
    mark_id="${req.body.mark_id}", 
    progress = "${req.body.progress}",
    date = current_date();`;

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

// 사용자 일간목표 추가 (닉네임, 목표목록, 클리어 여부): mark_id or err
type setuserdatemark = {
    user_name: string; // 닉네임
    mark_list: string; // 목표 목록
};
const setuserdatemark = {
    user_name: "string",
    mark_list: "string",
};
mark.post("/setuserdatemark", (req: TypedRequestBody<setuserdatemark>, res) => {
    if (!sameobj(setuserdatemark, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuserdatemark });
        return;
    }
    const query = `insert into User_date_mark (user_name, mark_list)
    values ("${req.body.user_name}", "${req.body.mark_list}");
    select mark_id from User_date_mark where user_name="${req.body.user_name}" && mark_list="${req.body.mark_list}";`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[][]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            if (!results?.length || !results[1].length) {
                console.error("항목없음");
                res.status(500).json({ err: "empty" });
            } else {
                res.json({results: results[1][0].mark_id});
            }
        }
    });

    dbconect.end();
});

// 사용자 일간목표 달성 여부 및 목표 수정 (닉네임, 일간목표id, 목표목록 클리어 여부): err or ok
type upuserdatemark = {
    user_name: string; // 닉네임
    mark_id: number; // 일간목표id
    mark_list: string; // 목표 목록
    is_clear: boolean; // 클리어 여부 1=클리어 0=아님
};
const upuserdatemark = {
    user_name: "string",
    mark_id: "int",
    mark_list: "string",
    is_clear: "boolean"
};
mark.post("/upuserdatemark", (req: TypedRequestBody<upuserdatemark>, res) => {
    if (!sameobj(upuserdatemark, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: upuserdatemark });
        return;
    }
    const query = `update User_date_mark
    set mark_list = "${req.body.mark_list}", is_clear = ${req.body.is_clear}
    where user_name="${req.body.user_name}" && mark_id=${req.body.mark_id};`;

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

// 사용자 일간목표 삭제 (닉네임, 일간목표id, 목표목록 클리어 여부): err or ok
type deluserdatemark = {
    user_name: string; // 닉네임
    mark_id: number; // 일간목표id
};
const deluserdatemark = {
    user_name: "string",
    mark_id: "int",
};
mark.post("/deluserdatemark", (req: TypedRequestBody<deluserdatemark>, res) => {
    if (!sameobj(deluserdatemark, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: deluserdatemark });
        return;
    }
    const query = `delete from User_date_mark where
    user_name = "${req.body.user_name}" && mark_id = ${req.body.mark_id};`;

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
