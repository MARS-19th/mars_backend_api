/* 파일 업로드 필요한 API 들 */
import express = require("express");
import mysql = require("mysql");
import multter = require("multer");
import fs = require("fs");
import { sameobj } from "../server";
import path = require("path");
import { getDBConnection } from "../DBConnection";
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

// 유저 프로필 사진 리턴 (닉네임): err or file
// 안드로이드에서 url 리소스 불러올수 있게
fileupload.get("/getprofile/:name", async (req, res) => {
    const query = `select profile_local from User_data where user_name = "${req.params.name}";`;

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
                const local = path.join(savepath, results[0].profile_local);
                if (fs.existsSync(local)) {
                    res.sendFile(local);
                } else {
                    res.sendFile(path.join(savepath, "default_profile.png"));
                }
            }
        }
    });
});

// 상점 아이템 미리보기 이미지 불러오기 (아이템id): err or file
// 안드로이드에서 url 리소스 불러올수 있게
fileupload.get("/getshopitemimg/:id", async (req, res) => {
    const query = `select image_local from Shop_item where object_id = ${req.params.id};`;

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
                const local = path.join(savepath, "/shop", results[0].image_local);
                if (fs.existsSync(local)) {
                    res.sendFile(local);
                } else {
                    res.sendFile(path.join(savepath, "/shop", "object.png"));
                }
            }
        }
    });
});

// 상점 아이템 에셋 불러오기 (아이템id): err or file
// 유니티 에셋을 불러올 수 있어야함
fileupload.get("/getshopitemasset/:id", async (req, res) => {
    const query = `select asset_local from Shop_item where object_id = ${req.params.id};`;

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
                const local = path.join(savepath, "/shop", results[0].asset_local);
                if (fs.existsSync(local)) {
                    res.sendFile(local);
                } else {
                    res.sendFile(path.join(savepath, "/shop", "default_profile.png"));
                }
            }
        }
    });
});

// 프로필 사진 업로드 (닉네임): err or results
type uploadprofile = {
    user_name: string;
};
const uploadprofile = {
    user_name: "string",
};
fileupload.post("/uploadprofile", uploadMiddleware, async (req, res) => {
    console.log(req.file);
    const filename = req.file?.filename;
    const data: uploadprofile = JSON.parse(req.body.data);

    if (!filename) {
        res.status(500).json({ err: "file_upload_err" });
        return;
    } else if (!sameobj(uploadprofile, data)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: uploadprofile });
        return;
    }

    const query = `update User_data set profile_local = "${filename}" where user_name = "${data.user_name}";`;

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

export default fileupload;
