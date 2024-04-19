const router = require("express").Router();
const User = require("./../models/User.model.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
//! We are prefixed with => /api

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/authentication", require("./authentication.routes.js"));

router.use("/cards", require("./cards.routes.js"));

router.use("/readings", require("./readings.routes.js"));

module.exports = router;
