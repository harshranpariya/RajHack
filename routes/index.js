var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("nearby", { title: "Express" });
});

router.get("/about", function(req, res, next) {
  res.render("about", { title: "Express" });
});

router.get("/data", function(req, res, next) {
  res.render("data", { title: "Express" });
});

router.get("/nearby", function(req, res, next) {
  res.render("nearby", { title: "Express" });
});

router.get("/review", function(req, res, next) {
  res.render("reviewData", { title: "Express" });
});

module.exports = router;
