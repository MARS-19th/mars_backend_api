/* vr에 필요한 데이터 */
import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, sameobj, serverset } from "../server";
const vr_info = express.Router();

// 해당 목표에 모든 문제들 리턴(목표): [{문제id, 스킬, 문제, 정답, 정답률, 선지 []}]
vr_info.get("/vr/getallexam/:mark", (req, res) => {
    const query = `select exam_id, skill_field, exam, correct, rate from VR_exam where 
    target_mark = "${req.params.mark}";
    select exam_id, exam_option from VR_exam_option where exam_id in (select exam_id from VR_exam where 
    target_mark = "${req.params.mark}");`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[][]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            if (!results?.length) {
                console.error("항목없음");
                res.status(500).json({ err: "empty" });
            } else {
                const exam = results[0].map((line) => {
                    const id = line.exam_id;
                    const examlist = results[1]
                        .filter((line) => {
                            return line.exam_id === id;
                        })
                        .map((line) => {
                            return line.exam_option;
                        });

                    return { ...line, exam_option: examlist };
                });

                res.json({ results: exam });
            }
        }
    });

    dbconect.end();
});

// 해당 목표와 스킬에 대한 랜덤 문제 리턴(목표, 스킬): {문제id, 문제, 정답, 정답률, 선지 []}
vr_info.get("/vr/getallexam/:mark/:skill", (req, res) => {
    const query = `select exam_id, exam, correct, rate from VR_exam where 
    target_mark = "${req.params.mark}" && skill_field = "${req.params.skill}";
    select exam_id, exam_option from VR_exam_option where exam_id in (select exam_id from VR_exam where 
    target_mark = "${req.params.mark}" && skill_field = "${req.params.skill}");`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[][]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            /* [{문제id, 문제, 선지 [] 정답, 정답률, }] */
            if (!results?.length || !results[0].length) {
                console.error("항목없음");
                res.status(500).json({ err: "empty" });
            } else {
                const rand = Math.floor(Math.random() * results[0].length);
                const exam = results[0][rand];

                const examlist = results[1]
                    .filter((line) => {
                        return line.exam_id === exam.exam_id;
                    })
                    .map((line) => {
                        return line.exam_option;
                    });

                res.json({ ...exam, exam_option: examlist });
            }
        }
    });

    dbconect.end();
});

// 사용자가 푼 문제 (이름) 푼문제, 맞춘여부(0은 틀린가 100은 맞춘거) or err
vr_info.get("/vr/userexam/:name", (req, res) => {
    const query = `select VR_exam.exam, VR_exam_stat.is_correct
    from VR_exam_stat join VR_exam on VR_exam_stat.exam_id = VR_exam.exam_id
    where VR_exam_stat.user_name = "${req.params.name}";`;

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

// 사용자 정답 여부 (맞으면 100, 틀리면 0) err or ok
type iscorrect = {
    user_name: string; // 닉네임
    exam_id: number; //문제id
    iscorrect: number; // 정답여부
};
const iscorrect = {
    user_name: "string",
    exam_id: "int",
    iscorrect: "int(100 또는 0)",
};
vr_info.post("/vr/iscorrect", (req: TypedRequestBody<iscorrect>, res) => {
    if (!sameobj(iscorrect, req.body) || (req.body.iscorrect != 100 && req.body.iscorrect != 0)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: iscorrect });
        return;
    }

    const query = `insert into VR_exam_stat values("${req.body.user_name}", ${req.body.exam_id}, ${req.body.iscorrect}) 
    on duplicate key update is_correct = ${req.body.iscorrect};`;

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

export default vr_info;
