import express = require("express");
import jwttoken = require("jsonwebtoken");
import { serverset } from "../server";
const JWTLogin = express.Router();

// 로그인 토큰 발급 타입
type loginbody = {
    admin_passwd: string;
};

// jwt 디코딩 타입
type resjwt = {
    connect_ip: string;
    exp: number;
    iat: number;
    iss: string;
};

//리프레쉬 토큰 body 타입
type refreshbody = {
    access_token: string;
    refresh_token: string;
};

// jwt 최초 로그인
JWTLogin.post("/api/loginjwt", (req, res) => {
    const body: loginbody = req.body;

    const connect_ip = req.ip;
    const key = serverset.jwt_secret_key;

    const access_token = jwttoken.sign(
        {
            connect_ip: connect_ip,
        },
        key,
        {
            expiresIn: "1h",
            issuer: "server",
        }
    );

    const refresh_token = jwttoken.sign({}, key, {
        expiresIn: "30d",
        issuer: "server",
    });

    const data = jwttoken.decode(access_token) as resjwt;

    res.json({
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: data.exp * 1000, // 토큰이 만료 되는 시간 (밀리초)
    });
});

//토큰 검증
JWTLogin.post("/api/verifyjwt", (req, res) => {
    const access_token: string = req.body.access_token;

    try {
        const userdata = jwttoken.verify(
            access_token,
            serverset.jwt_secret_key
        );
        res.send(userdata);
    } catch (err: any) {
        res.status(500).json({
            err: err.message,
        });
    }
});

// 토큰 재발급
JWTLogin.post("/api/refreshjwt", (req, res) => {
    const body: refreshbody = req.body;

    //access_token 디코딩
    const userdata = jwttoken.decode(body.access_token) as resjwt;
    

    //access_token 토큰이 맞는토큰인지 확인
    if (!userdata) {
        res.status(500).json({
            err: "refresh_fail",
        });
    }
    try {
        // refresh_token 유효성 확인
        jwttoken.verify(body.refresh_token, serverset.jwt_secret_key);

        const connect_ip = userdata.connect_ip;
        
        const key = serverset.jwt_secret_key;

        // access_token 재발급
        const access_token = jwttoken.sign(
            {
                connect_ip: connect_ip,
            },
            key,
            {
                expiresIn: "1h",
                issuer: "server",
            }
        );

        const data = jwttoken.decode(access_token) as resjwt;

        res.json({
            access_token: access_token,
            refresh_token: body.refresh_token,
            expires_in: data.exp * 1000, // 토큰이 만료 되는 시간 (밀리초)
        });
    } catch (err: any) {
        // refresh 토큰 만료시
        res.status(500).json({
            err: "refresh_fail",
        });
    }
});

export default JWTLogin;
