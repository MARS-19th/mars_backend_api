import * as mysql from "mysql";
import * as fs from "fs";
const serverset = JSON.parse(fs.readFileSync("server.json", "utf-8"));

function gettest() {
    const query = `SELECT id, passwd from User;`;

    const dbconect = mysql.createConnection(serverset.setdb);
    dbconect.connect();

    dbconect.query(query, (err: mysql.MysqlError, results?: any[]) => {
        results?.forEach((line) => {
            console.log(line);
        });
        if (err) {
            console.log(err);
        }
    });

    dbconect.end();
}

async function settest(url: string) {
    const id = "dada0713";
    const passwd = "hyhy1503";

    const response = await fetch(`http://korseok.kro.kr/api/${url}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
        }),
    });

    if (response.ok) {
        console.log("성공!");
    } else {
        console.log("오류남");
    }
}

gettest();
