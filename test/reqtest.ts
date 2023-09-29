import * as fs from "fs";
const serverset = JSON.parse(fs.readFileSync("bin/server.json", "utf-8"));

async function gettest(url: string) {
    const response = await fetch(`http://korseok.kro.kr/api/${url}`);

    const res = await response.json();
    console.log(res);
}

async function settest(url: string) {
    const body = {
        user_name: "관리자1",
        mark_id: 10,
        is_clear: true,
    };

    const response = await fetch(`http://korseok.kro.kr/api/${url}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const res = await response.json();
    console.log(res);
}

settest("setuserdatemark");
