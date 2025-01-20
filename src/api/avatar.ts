/* 아바타 커스텀/상점 */
import express = require("express");
import mysql = require("mysql");
import { TypedRequestBody, sameobj } from "../server";
import { getDBConnection } from "../DBConnection";
const avatar = express.Router();

// 유저의 아바타 불러오기 (이름): err or {look, color}
avatar.get("/getuseravatar/:name", async (req, res) => {
    const query = `select type, look, color, moun_shop from User_avatar where user_name = "${req.params.name}";`;

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

// 상점 전체 아이템 아이디 불러오기: [{아이디, 이름, 가격}] or err
avatar.get("/getshopitemid", async (req, res) => {
    const query = `select object_id, item_name, type, price from Shop_item;`;

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

// 상점 아이템 아이디 불러오기 (타입): [{아이디, 이름, 가격}] or err
avatar.get("/getshopitemid/:type", async (req, res) => {
    const query = `select object_id, item_name, price from Shop_item where type ="${req.params.type}";`;

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

// 해당 유저가 장착 상점 아이템 불러오기 (닉네임): {장착한 상점 아이템 id} or err
avatar.get("/getuserfititem/:name", async (req, res) => {
    const query = `select moun_shop from User_avatar where user_name="${req.params.name}"`;

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

// 해당 유저의 인벤토리 불러오기 (닉네임): [{객체id, 아이템이름, 타입}]
avatar.get("/getuserinventory/:name", async (req, res) => {
    const query = `select User_inventory.object_id, Shop_item.item_name, Shop_item.type from User_inventory 
    join Shop_item on Shop_item.object_id = User_inventory.object_id
    where user_name="${req.params.name}";`;

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

// 유저 아바타 생성 (이름, 타입(고양이, 원숭이), 표정을 식별하는 데이터, 색상을 식별하는 데이터): err or ok
type setuseravatar = {
    user_name: string;
    type: string;
    look: string;
    color: string;
};
const setuseravatar = {
    user_name: "string",
    type: "string",
    look: "string",
    color: "string",
};
avatar.post("/setuseravatar", async (req: TypedRequestBody<setuseravatar>, res) => {
    if (!sameobj(setuseravatar, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuseravatar });
        return;
    }
    const query = `insert into User_avatar (user_name, type, look, color) 
    values ("${req.body.user_name}", "${req.body.type}", "${req.body.look}", "${req.body.color}") on duplicate key update
    type = "${req.body.type}",
    look = "${req.body.look}",
    color = "${req.body.color}";`;

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

// 유저의 장착한 아이템 변경 (닉네임, 모자id, 상의id, 바지id, 안경id): ok or err
type setuserfititem = {
    user_name: string;
    moun_shop: number | null;
};
const setuserfititem = {
    user_name: "string",
    moun_shop: "int 또는 null",
};
avatar.post("/setuserfititem", async (req: TypedRequestBody<setuserfititem>, res) => {
    if (!sameobj(setuserfititem, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuserfititem });
        return;
    }
    const query = `update User_avatar set moun_shop = ${req.body.moun_shop} where user_name = "${req.body.user_name}";`;

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

// 유저 인벤토리 아이템 추가 (닉네임, 모자id, 상의id, 바지id, 안경id): ok or err
type setuserinventory = {
    user_name: string;
    object_id: number;
};
const setuserinventory = {
    user_name: "string",
    object_id: "int",
};
avatar.post("/setuserinventory", async (req: TypedRequestBody<setuserinventory>, res) => {
    if (!sameobj(setuserinventory, req.body)) {
        console.error("값이 잘못넘어옴");
        res.status(500).json({ err: "type_err", type: setuserinventory });
        return;
    }
    const query = `insert into User_inventory values ("${req.body.user_name}", ${req.body.object_id})`;

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

export default avatar;
