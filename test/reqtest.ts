import * as fs from "fs";
const serverset = JSON.parse(fs.readFileSync("bin/server.json", "utf-8"));

async function gettest(url: string) {
    const response = await fetch(`http://korseok.kro.kr/api/${url}`);

    const res = await response.json();
    console.log(res);
}

async function settest(url: string) {
    const user_name = "관리자2";
    const look = 1;
    const color = 3;

    const response = await fetch(`http://korseok.kro.kr/api/${url}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_name: user_name,
            look: look,
            color: color,
        }),
    });

    const res = await response.json();
    console.log(res);
}

settest("/avatar/setuseravatar");
