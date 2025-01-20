import mysql = require("mysql");
import { EventEmitter } from "events";

// 이벤트 리스너 & Promise 조합으로 관리
const eventListener = new EventEmitter();
let connection: mysql.Connection | undefined;

function CreateDBConnection(DBConfig: mysql.ConnectionConfig) {
    const dbconect = mysql.createConnection(DBConfig);
    dbconect.connect((err) => {
        if (err) {
            eventListener.emit("error", err);
        } else {
            connection = dbconect;
            eventListener.emit("connected", dbconect);
        }
    });
}

function getDBConnection(): Promise<mysql.Connection> {
    return new Promise((resolve, reject) => {
        if (connection) {
            resolve(connection);
        } else {
            eventListener.on("connected", (dbconect: mysql.Connection) => {
                resolve(dbconect);
            });
        }
    });
}

export { CreateDBConnection, getDBConnection };
