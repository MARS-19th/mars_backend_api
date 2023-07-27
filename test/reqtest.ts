import * as fs from "fs";
const serverset = JSON.parse(fs.readFileSync("bin/server.json", "utf-8"));

async function gettest(url: string) {
    const response = await fetch(`http://korseok.kro.kr/api/${url}`);

    const res = await response.json();
    console.log(res);
}

async function settest(url: string) {
    const user_name = "관리자2";
    const element1 = 1;
    const element2 = 2;
    const element3 = 3;
    const element4 = 4;

    const response = await fetch(`http://korseok.kro.kr/api/${url}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_name: user_name,
            element1: element1,
            element2: element2,
            element3: element3,
            element4: element4,
        }),
    });

    const res = await response.json();
    console.log(res);
}

settest("/avatar/setuseravatar");
