/* eslint-disable no-unused-vars */
const express = require("express");

const app = express();
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

module.exports = router;
