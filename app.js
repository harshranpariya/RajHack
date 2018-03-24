var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var stylus = require("stylus");
var fs = require("fs");
var readline = require("readline");
var google = require("googleapis");
var googleAuth = require("google-auth-library");
var router = express.Router();
var request = require("request");
var index = require("./routes/index");
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var nodemailer = require("nodemailer");

var app = express();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thobhanifreddy@gmail.com",
    pass: "60bGYGTJsrc2"
  }
});

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./Data/uploads");
  },
  filename: function(req, file, callback) {
    callback(null, String(num));
  }
});

var upload = multer({ storage: storage }).single("userPhoto");

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "sheets.googleapis.com-nodejs-quickstart.json";

// Load client secrets from a local file.

var val = [];
var num = 1;

// view engine setup
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next) {
  var _send = res.send;
  var sent = false;
  res.send = function(data) {
    if (sent) return;
    _send.bind(res)(data);
    sent = true;
  };
  next();
});

app.use("/", index);
app.post("/count", function(req, res) {
  console.log(req.body.count);
  if (parseInt(req.body.count) == 5) {
    console.log("email sent");
    var mailOptions = {
      from: "thobhanifreddy@gmail.com",
      to: "thobhani.freddy@gmail.com",
      subject: "Toilets not available",
      text:
        "This is sauchalaya.in informing you unavailablity of toilet in undifined location!"
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        res.send("something went wrong");
      } else {
        console.log("Email sent: " + info.response);
        res.send("email send");
      }
    });
  }
});

app.post("/api/photo", function(req, res) {
  upload(req, res, function(err) {
    console.log(req.body);

    val = [];
    val.push([
      num,
      req.body.city,
      req.body.lat,
      req.body.lng,
      req.body.feedback
    ]);

    if (err) {
      return res.end("Error uploading file.");
    } else {
      if (err) {
        res.send("Error updating Cells");
      } else {
        res.send(" Cells Updated");
        num += 1;
      }
      MongoClient.connect("mongodb://localhost:27017/sauchalaya", function(
        err,
        client
      ) {
        if (err) throw err;
        var db = client.db("sauchalaya");
        db.collection("Location", function(err, collection) {
          collection.insert({
            city: req.body.city,
            latitude: req.body.lat,
            longitude: req.body.lng,
            feedback: req.body.feedback
          });
        });
        db.collection("Location").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

        });
      });
    }
    res.send("success");
  });
});

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
