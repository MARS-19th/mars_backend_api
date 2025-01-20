/* 회원 가입/탈퇴/로그인 */
import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, fcm, sameobj } from "../server";
import { getDBConnection } from "../DBConnection";
const user = express.Router();

// 회원 모든 정보 조회 (유저이름): err or 모든 유저 정보
user.get("/getuserdata/:name", async (req, res) => {
    const query = `select *from User_data where user_name = "${req.params.name}";`;

    const dbconect = await getDBConnection();

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
});

// 회원 블루투스 uuid 리턴 (유저이름): err or bt_mac
user.get("/getuserbtuuid/:name", async (req, res) => {
    const query = `select identifier_code from User_identifier_code where 
    type = "bt_uuid" && user_name = "${req.params.name}";`;

    const dbconect = await getDBConnection();

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
});

// 회원 블루투스 uuid 로 사용자 정보들 리턴 err or 모든 유저 정보
user.get("/getbtuserdata/:uuid", async (req, res) => {
    const query = `select *from User_data where user_name =
    (select user_name from User_identifier_code where 
    type = "bt_uuid" && identifier_code = "${req.params.uuid}");`;

    const dbconect = await getDBConnection();

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
});

// 친구 목록 (닉네임): err or results: [{친구 닉네임, 수락여부}]
user.get("/getfriend/:name", async (req, res) => {
    const query = `select friend from User_friend where user_name = "${req.params.name}";
    select user_name from User_friend where friend = "${req.params.name}";`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[][]) => {
        if (!results?.length || !results[0].length) {
            console.error("항목없음");
            res.status(500).json({ err: "empty" });
        } else {
            if (!results?.length) {
                console.error("항목없음");
                res.status(500).json({ err: "empty" });
            } else {
                // 두번째 쿼리 결과값에 이름 값만 추출해서 다시 저장
                results[1] = results[1].map((line) => {
                    return line.user_name;
                });

                // 해당 사용자의 친구가 요청을 받아서 양쪽으로 친추가 됬는지 확인
                results[0] = results[0].map((line) => {
                    if (results[1].includes(line.friend)) {
                        return { ...line, isaccept: true };
                    } else {
                        return { ...line, isaccept: false };
                    }
                });

                res.json({ results: results[0] });
            }
        }
    });
});

// 친구 요청자 목록 (닉네임): err or results: [...친구요청자 닉네임]
user.get("/getreqfriend/:name", async (req, res) => {
    const query = `select user_name from User_friend 
    where friend ="${req.params.name}" && user_name not in 
    (select friend from User_friend where user_name="${req.params.name}");`;

    const dbconect = await getDBConnection();

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
                    return line.user_name;
                });
                res.json({ results });
            }
        }
    });
});

// 모든 칭호들 리턴: [{칭호명, 분류, 레벨}]
user.get("/usertitle", async (req, res) => {
    const query = `select *from User_Title order by level, class;`;

    const dbconect = await getDBConnection();

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
});

// 사용자가 획득한 칭호들 리턴 (닉네임): err or results: [...칭호들]
user.get("/usergettitle/:name", async (req, res) => {
    const query = `select user_title from User_get_title where user_name = "${req.params.name}";`;

    const dbconect = await getDBConnection();

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
                    return line.user_title;
                });
                res.json({ results });
            }
        }
    });
});

// 모든 회원 정보 추가 (닉네임, 아이디, 목표, 프사경로): ok or err
type setuser = {
    user_name: string;
    user_id: string;
    choice_mark: string;
    profile_local: string | null; // profile_local 은 있거나 없거나
};
const setuser = {
    user_name: "string",
    user_id: "string",
    choice_mark: "string",
    profile_local: "string 또는 null",
};
user.post("/setuser", async (req: TypedRequestBody<setuser>, res) => {
    if (!sameobj(setuser, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuser });
        return;
    }

    if (!req.body.profile_local) {
        req.body.profile_local = "default_profile.png"; //기본 이미지
    }

    const query = `insert into User_data(user_name, user_id, choice_mark, profile_local) values 
    ("${req.body.user_name}", "${req.body.user_id}", "${req.body.choice_mark}", "${req.body.profile_local}");`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code }); // ER_DUP_ENTRY = 중복 발생함
        } else {
            res.json({ results: true });
        }
    });
});

//유저 블루투스 uuid 설정 (닉네임, 블루투스 uuid): err or ok
type setuserbtuuid = {
    user_name: string;
    bt_uuid: string;
};
const setuserbtuuid = {
    user_name: "string",
    bt_uuid: "string",
};
user.post("/setuserbtuuid", async (req: TypedRequestBody<setuserbtuuid>, res) => {
    if (!sameobj(setuserbtuuid, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuserbtuuid });
        return;
    }

    const query = `insert into User_identifier_code values ("bt_uuid", "${req.body.user_name}", "${req.body.bt_uuid}") 
    on duplicate key update identifier_code = "${req.body.bt_uuid}";`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: true });
        }
    });
});

//유저 fcm 토큰키 설정 (닉네임, fcm 토큰키): err or ok
type setuserfcmtoken = {
    user_name: string;
    fcm_token: string;
};
const setuserfcmtoken = {
    user_name: "string",
    fcm_token: "string",
};
user.post("/setuserfcmtoken", async (req: TypedRequestBody<setuserfcmtoken>, res) => {
    if (!sameobj(setuserfcmtoken, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuserfcmtoken });
        return;
    }

    const query = `insert into User_identifier_code values ("fcm_token", "${req.body.user_name}", "${req.body.fcm_token}") 
    on duplicate key update identifier_code = "${req.body.fcm_token}";`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: true });
        }
    });
});

// 유저 재화 조정 (닉네임, 값): err or 조정한 값
type setmoney = {
    user_name: string;
    value: number;
};
const setmoney = {
    user_name: "string",
    value: "int",
};
user.post("/setmoney", async (req: TypedRequestBody<setmoney>, res) => {
    if (!sameobj(setmoney, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setmoney });
        return;
    }

    const query = `update User_data SET money = ${req.body.value} where
    user_name = "${req.body.user_name}"; `;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: req.body.value });
        }
    });
});

// 유저 목숨 조정 (닉네임, 값): err or 조정한 값
type setlife = {
    user_name: string;
    value: number;
};
const setlife = {
    user_name: "string",
    value: "int",
};
user.post("/setlife", async (req: TypedRequestBody<setlife>, res) => {
    if (!sameobj(setlife, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setlife });
        return;
    }

    const query = `update User_data SET life = ${req.body.value} where
    user_name = "${req.body.user_name}"; `;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: req.body.value });
        }
    });
});

// 유저 레벨 조정 (닉네임, 값): err or 조정한 값
type setlevel = {
    user_name: string;
    value: number;
};
const setlevel = {
    user_name: "string",
    value: "int",
};
user.post("/setlevel", async (req: TypedRequestBody<setlevel>, res) => {
    if (!sameobj(setlevel, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setlevel });
        return;
    }

    const query = `update User_data SET level = ${req.body.value} where
    user_name = "${req.body.user_name}"; `;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: req.body.value });
        }
    });
});

// 유저 칭호 변경 (닉네임, 값): err or 조정한 값
type setusertitle = {
    user_name: string;
    value: string;
};
const setusertitle = {
    user_name: "string",
    value: "string",
};
user.post("/setusertitle", async (req: TypedRequestBody<setusertitle>, res) => {
    if (!sameobj(setusertitle, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setusertitle });
        return;
    }

    const query = `update User_data SET user_title = "${req.body.value}" where
    user_name = "${req.body.user_name}"; `;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code }); //ER_NO_REFERENCED_ROW_2 (외래키 조건으로 인한 예외)
        } else {
            res.json({ results: req.body.value });
        }
    });
});

// 유저 이름 변경 (기존이름, 바꾼이름): err: exist or 바꾼 값
type setname = {
    curname: string; // 기존이름
    newname: string; // 바꾼이름
};
const setname = {
    curname: "string",
    newname: "string",
};
user.post("/setname", async (req: TypedRequestBody<setname>, res) => {
    if (!sameobj(setname, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setname });
        return;
    }

    const query = `update User_data set user_name = "${req.body.newname}" where user_name = "${req.body.curname}";`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            //ER_FOREIGN_DUPLICATE_KEY_WITH_CHILD_INFO 닉네임 중복 발생
            if (err.code === "ER_FOREIGN_DUPLICATE_KEY_WITH_CHILD_INFO") {
                console.error("중복발생");
                res.status(500).json({ err: "exist" });
            } else {
                console.error(err);
                res.status(500).json({ err: err.code });
            }
        } else {
            res.json({ results: req.body.newname });
        }
    });
});

// 친구 추가(닉네임, 친구닉네임): err: ER_DUP_ENTRY(pk 중복체크) or ok
type setfriend = {
    user_name: string; // 닉네임
    friend: string; // 친구 이름
};
const setfriend = {
    user_name: "string",
    friend: "string",
};
user.post("/setfriend", async (req: TypedRequestBody<setfriend>, res) => {
    if (!sameobj(setfriend, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setfriend });
        return;
    }

    const query = `insert into User_friend values ("${req.body.user_name}", "${req.body.friend}");`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: true });
        }
    });
});

// 친구 삭제(닉네임, 친구닉네임): err or ok
type delfriend = {
    user_name: string; // 닉네임
    friend: string; // 친구 이름
};
const delfriend = {
    user_name: "string",
    friend: "string",
};
user.post("/delfriend", async (req: TypedRequestBody<delfriend>, res) => {
    if (!sameobj(delfriend, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: delfriend });
        return;
    }

    const query = `delete from User_friend where 
    user_name = "${req.body.user_name}" && friend = "${req.body.friend}" || 
    user_name = "${req.body.friend}" && friend = "${req.body.user_name}";`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            res.json({ results: true });
        }
    });
});

//닉네임 중복 체크 (닉네임): err or ok
type chname = {
    user_name: string; // 닉네임
};
const chname = {
    user_name: "string",
};
user.post("/checkname", async (req: TypedRequestBody<chname>, res) => {
    if (!sameobj(chname, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: chname });
        return;
    }

    const query = `select user_name from User_data where user_name = "${req.body.user_name}";`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            if (results?.length) {
                console.error("중복발견");
                res.json({ results: false });
            } else {
                res.json({ results: true });
            }
        }
    });
});

// 유저 메시지 fcm 서버로 push (보낸이, 받는이, 메시지): success_send or err
type pushuserchat = {
    user_name: string;
    from_user: string;
    messge: string;
};
const pushuserchat = {
    user_name: "string",
    from_user: "string",
    messge: "string",
};
user.post("/pushuserchat", async (req: TypedRequestBody<pushuserchat>, res) => {
    if (!sameobj(pushuserchat, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: pushuserchat });
        return;
    }

    const query = `select identifier_code from User_identifier_code 
    where type="fcm_token" && user_name="${req.body.from_user}";`;

    const dbconect = await getDBConnection();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ err: err.code });
        } else {
            if (!results?.length) {
                console.error("항목없음");
                res.status(500).json({ err: "unfound_fcm_token" });
            } else {
                const fcm_token = results[0].identifier_code;
                console.log(`${req.body.from_user}의 fcm_token: ${fcm_token}`);

                // 보낼 메시지
                const message = {
                    notification: {
                        title: req.body.user_name,
                        body: req.body.messge,
                    },
                    token: fcm_token,
                };

                // fcm 에 메시지 전송
                fcm.messaging()
                    .send(message)
                    .then(() => {
                        console.log(
                            `성공적으로 메시지 전송\n보낸이: ${req.body.user_name}, 받는이: ${req.body.from_user}, 메시지: ${req.body.messge}`
                        );
                        res.json({
                            results: "success_send",
                            notification: {
                                title: req.body.user_name,
                                body: req.body.messge,
                            },
                        });
                    })
                    .catch((err) => {
                        console.log(`메시지 전송 오류: ${err}`);
                        res.json({ results: "send_err" });
                    });
            }
        }
    });
});

export default user;
