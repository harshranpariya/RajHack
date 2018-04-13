var express = require("express");
var path = require("path");
var https = require("https");
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
var request = require("request");

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

// Load client secrets from a local file.
var upload = multer({ storage: storage }).single("userPhoto");

request("https://freegeoip.net/json", function(error, response, body) {
  console.log("error:", error); // Print the error if one occurred
  console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
  console.log("body:", body); // Print the HTML for the Google homepage.
});

var databaseData = [];
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

// request("https://freegeoip.net/json", function(error, response, body) {
//   console.log(JSON.parse(body).longitude);
//   console.log(body);
// });

app.use("/", index);
app.post("/count", function(req, res) {
  console.log(req.body.count);
  if (parseInt(req.body.count) == 5) {
    console.log("email sent");
    request("https://freegeoip.net/json", function(error, response, body) {
      console.log("body:", body); // Print the HTML for the Google homepage.

      var mailOptions = {
        from: "thobhanifreddy@gmail.com",
        to: "thobhani.freddy@gmail.com",
        subject: "Toilets not available",
        text:
          "This is sauchalaya.in informing you unavailablity of toilet at " +
          JSON.parse(body).latitude +
          " " +
          JSON.parse(body).longitude
      };

      // transporter.sendMail(mailOptions, function(error, info) {
      //   if (error) {
      //     console.log(error);
      //     res.send("something went wrong");
      //   } else {
      //     console.log("Email sent: " + info.response);
      //     res.send("email send");
      //   }
      // });
    });
  }
});
var offlineData = null;
app.post("/offlineData", function(req, res) {
  console.log(req.body);
  offlineData = req.body;
  res.send("offlice data send");
});

app.post("/offlinrMapData", function(req, res) {
  res.send(offlineData);
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
        db
          .collection("Location")
          .find({})
          .toArray(function(err, result) {
            if (err) throw err;

            result.forEach(toilet => {
              databaseData.push({
                lat: parseFloat(toilet.latitude),
                lng: parseFloat(toilet.longitude)
              });
              console.log(databaseData);
            });
          });
      });
    }
    res.send("success");
  });
});

MongoClient.connect("mongodb://localhost:27017/sauchalaya", function(
  err,
  client
) {
  if (err) throw err;
  var db = client.db("sauchalaya");
  db
    .collection("Location")
    .find({})
    .toArray(function(err, result) {
      if (err) throw err;
      // console.log(result);
      result.forEach(toilet => {
        databaseData.push({
          lat: parseFloat(toilet.latitude),
          lng: parseFloat(toilet.longitude)
        });
      });
      console.log(databaseData);
    });
});

app.post("/databaseData", function(req, res) {
  res.send(databaseData);
});

// app.get("/databaseData", function(req, res) {
//   console.log("here ---> ");
//   console.log(req.body);
//   res.send()
// });

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
