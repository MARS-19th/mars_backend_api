"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mysql = require("mysql");
var server_1 = require("../server");
var router = express.Router();
router.get("/getlogin/:id", function (req, res) {
    //회원 이름 => 아이디, 패스워드
    var query = "SELECT id, passwd from User JOIN User_data on User.id = User_data.user_id WHERE User_data.user_name = \"".concat(req.params.id, "\";");
    var dbconect = mysql.createConnection(server_1.serverset.setdb);
    dbconect.connect();
    dbconect.query(query, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else if (results === null || results === void 0 ? void 0 : results.length) {
            res.send(results[0]);
        }
        else {
            res.status(403).send();
        }
    });
    dbconect.end();
});
router.post("/setuser", function (req, res) {
    var query = "insert into User values('".concat(req.body.id, "', '").concat(req.body.passwd, "');");
    var dbconect = mysql.createConnection(server_1.serverset.setdb);
    dbconect.connect();
    dbconect.query(query, function (err, results) {
        if (err) {
            console.log(err);
            res.status(403).send();
        }
        else {
            res.send();
        }
    });
    dbconect.end();
});
router.post("/deluser", function (req, res) {
    var query = "DELETE from User WHERE id = \"".concat(req.body.id, "\"");
    var dbconect = mysql.createConnection(server_1.serverset.setdb);
    dbconect.connect();
    dbconect.query(query, function (err, results) {
        if (err) {
            console.log(err);
            res.status(403).send();
        }
        else {
            res.send();
        }
    });
    dbconect.end();
});
exports.default = router;
