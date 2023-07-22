"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverset = void 0;
var express = require("express");
var fs = require("fs");
var adminrouter_1 = require("./admin/adminrouter");
var apirouter_1 = require("./api/apirouter");
var server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/admin", adminrouter_1.default); //관리자 페이지 라우팅
server.use("/api", apirouter_1.default); //api 라우팅
var serverset = JSON.parse(fs.readFileSync("server.json", "utf-8"));
exports.serverset = serverset;
server.listen(serverset.port, function () {
    console.log("\uC11C\uBC84\uAC00 ".concat(serverset.port, "\uD3EC\uD2B8\uB85C \uC5F4\uB9BC"));
});
