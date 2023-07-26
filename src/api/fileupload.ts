import express = require("express");
import mysql = require("mysql");
import multter = require("multer");
import fs = require("fs");
import { TypedRequestBody, sameobj, serverset } from "../server";
import path = require("path");
const fileupload = express.Router();
const savepath = path.join(__dirname, "../res");

// 파일 저장 구현
const uploadMiddleware = multter({
    storage: multter.diskStorage({
        //req = express req, file= 업로드한 파일 done = 다음 작업을 넘기기?
        filename(req, file, done) {
            const filename = Math.random().toString(16).substring(2); //중복을 방지하기 위한 랜덤 문자열 생성
            const ext = path.extname(file.originalname);
            done(null, filename + ext); //파일 이름 지정
        },
        destination(req, file, done) {
            done(null, savepath); //파일 저장 위치
        },
    }),
    fileFilter(req, file, done) {
        const exec = [".jpg", ".jpeg", ".png"];
        console.log(path.extname(file.originalname));
        
        if (exec.includes(path.extname(file.originalname))) {
            done(null, true);
        } else {
            done(null, false);
        }
    },
}).single("file");

// 프로필 사진 업로드 (닉네임): err or results
type uploadprofile = {
    user_name: string;
};
fileupload.post("/uploadprofile", uploadMiddleware, (req: TypedRequestBody<uploadprofile>, res) => {
        console.log(req.file);
        const filename = req.file?.filename;
        const user_name = req.body.user_name;
        
        if (!filename) {
            res.status(500).json({ err: "file_upload_err" });
            return;
        }

        const query = `update User_data set profile_local = "${filename}" where user_name = "${user_name}";`;

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
    }
);


// 유저 프로필 사잔 리턴 (닉네임): err or file
// 안드로이드에서 네트워크로 리소스 불러올수 있게
fileupload.get("/getprofile/:name", (req, res) => {
    const query = `select profile_local from User_data where user_name = "${req.params.name}";`;

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
                const local = path.join(savepath, results[0].profile_local);
                if (fs.existsSync(local)) {
                    res.sendFile(local);
                } else {
                    res.sendFile(path.join(savepath, "default_profile.png"));
                }
            }
        }
    });

    dbconect.end();
});

export default fileupload;
