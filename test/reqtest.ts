import * as fs from "fs";
const serverset = JSON.parse(fs.readFileSync("bin/server.json", "utf-8"));

async function gettest(url: string) {
    const response = await fetch(`http://korseok.kro.kr/api/${url}`);

    const res = await response.json();
    console.log(res);
}

async function settest(url: string) {
    const user_name = "관리자1";
    const look = "식별하는 무언가1";
    const color = "식별하는 무언가2";

    const response = await fetch(`http://korseok.kro.kr/api/${url}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_name: "관리자1",
            mark_id: 1,
            progress: 100,
        }),
    });

    const res = await response.json();
    console.log(res);
}

settest("setuserskill");
