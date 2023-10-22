import express = require("express");
import mysql = require("mysql");
import path = require("path");
import { TypedRequestBody, serverset } from "../server";
const admin = express.Router();
const root = __dirname;

admin.use(express.static(root));

// 관리자 페이지 라우팅 설정
admin.get("/", (req, res) => {
    res.sendFile(path.join(root, "Home.html"));
});

admin.get("/login", (req, res) => {
    res.sendFile(path.join(root, "LoginPage", "LoginPage.html"));
});

admin.get("/ShopItem", (req, res) => {
    res.sendFile(path.join(root, "ShopItem", "ShopItem.html"));
});

admin.get("/UserAvatar", (req, res) => {
    res.sendFile(path.join(root, "UserAvatar", "UserAvatar.html"));
});

admin.get("/UserData", (req, res) => {
    res.sendFile(path.join(root, "UserData", "UserData.html"));
});

admin.get("/UserMark", (req, res) => {
    res.sendFile(path.join(root, "UserMark", "UserMark.html"));
});

admin.get("/UserIdentifier", (req, res) => {
    res.sendFile(path.join(root, "UserIdentifier", "UserIdentifier.html"));
});

admin.get("/VRExam", (req, res) => {
    res.sendFile(path.join(root, "VRExam", "VRExam.html"));
});

admin.get("/VRExamOption", (req, res) => {
    res.sendFile(path.join(root, "VRExamOption", "VRExamOption.html"));
});

/* 페이지별 api 목록 */

// 모든 회원정보 조회
admin.get("/api/getUser", (req, res) => {
    const query = `select user_name, user_id, choice_mark, user_title, profile_local, life, money, level from User_data;`;

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
                console.log("유저 정보 조회 완료");
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 모든 상점 아이템 조회
admin.get("/api/getshop", (req, res) => {
    const query = `select object_id, type, item_name, image_local, price from Shop_item;`;

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
                console.log("상점 아이템 조회 완료");
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 모든 유저 고유식별자 조회
admin.get("/api/getidentifier", (req, res) => {
    const query = `select type, user_name, identifier_code from User_identifier_code;`;

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
                console.log("유저 고유식별자 조회 완료");
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 모든 유저 아바타 조회
admin.get("/api/getavatar", (req, res) => {
    const query = `select user_name, type, look, color, moun_shop from User_avatar;`;

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
                console.log("유저 아바타 조회 완료");
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 모든 VR 문제 조회
admin.get("/api/getvrexam", (req, res) => {
    const query = `select exam_id, target_mark, skill_field, exam, correct, exam_type, rate from VR_exam;`;

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
                console.log("VR문제 조회 완료");
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 모든 VR 문제 답안 조회
admin.get("/api/getvrexamoption", (req, res) => {
    const query = `select exam_id, exam_option from VR_exam_option order by exam_id;`;

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
                console.log("VR 문제 답안 조회 완료");
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 유저 닉네임 유효성 체크
admin.get("/api/getusername/:name", (req, res) => {
    const query = `select user_name from User_data where user_name = "${req.params.name}";`;

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
                console.log("올바른 사용자");
                res.json(results);
            }
        }
    });

    dbconect.end();
});

// 해당 스킬에 세부 목표 id 얻기
admin.get("/api/getdetailsmarkid/:id", (req, res) => {
    const query = `select mark_id from Details_mark where skill_field ="${req.params.id}";`;

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
                console.log("세부 목표 id 조회 완료");

                results = results.map((line) => {
                    return line.mark_id;
                });
                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// 해당 유저가 얻은 모든 칭호 리턴
admin.get("/api/getusertitle/:name", (req, res) => {
    const query = `select user_title from User_get_title where user_name ="${req.params.name}";`;

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
                console.log("사용자 칭호들 조회 완료");

                results = results.map((line) => {
                    return line.user_title;
                });
                res.json({ results });
            }
        }
    });

    dbconect.end();
});

// db 테이블 업데이트
type updatadb = {
    table_name: string;
    target_column: string;
    updata_value: string;
    where: string;
};
admin.post("/api/updatadb", (req: TypedRequestBody<updatadb>, res) => {
    const query = `update ${req.body.table_name} set ${req.body.target_column} = "${req.body.updata_value}" where ${req.body.where};`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            console.log("테이블 수정 완료");
            res.json({ results: true });
        }
    });

    dbconect.end();
});

// db 테이블 값 삭제
type deldb = {
    table_name: string;
    where: string;
};
admin.post("/api/deldb", (req: TypedRequestBody<deldb>, res) => {
    const query = `delete from ${req.body.table_name} where ${req.body.where};`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            console.log("테이블 값 삭제 완료");
            res.json({ results: true });
        }
    });

    dbconect.end();
});

// db 테이블 값추가
type insertdb = {
    table_name: string;
    insert_item: string;
    insert_value: string;
};
admin.post("/api/insertdb", (req: TypedRequestBody<insertdb>, res) => {
    const query = `insert into ${req.body.table_name} (${req.body.insert_item}) values (${req.body.insert_value});`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            console.log("테이블 값 추가 완료");
            
            res.json({ results: results.insertId});
        }
    });

    dbconect.end();
});

// 관리자 페이지 로그인시 제대로된 비번인지
admin.post("/api/verifypasswd", (req , res) => {
    if (req.body.passwd === serverset.admin_passwd) {
        res.send({results: true});
    } else {
        res.status(500).send({results: false});
    }
});


export default admin;
