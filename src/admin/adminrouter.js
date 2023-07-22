"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.use(express.static(__dirname));
router.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
exports.default = router;
