import express = require("express");
const router = express.Router();

router.use(express.static(__dirname));

router.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

export default router;
