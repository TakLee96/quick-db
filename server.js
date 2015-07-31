var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var db = {};

app.use(function (req, res, next) {
    console.log("[%s] %s -> %s", new Date(), req.method, req.url);
    next();
});

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/:userid', function (req, res, next) {
    var userid = req.param.userid;
    var name = req.body.name;
    res.status(200).json(db[userid] && db[userid][name]).end();
});
app.post('/:userid', function (req, res, next) {
    var userid = req.param.userid;
    var name = req.body.name;
    var obj = req.body.obj;
    if (!db[userid]) {
        db[userid] = {};
    }
    db[userid][name] = obj;
    res.status(200).end();
});
app.delete('/:userid', function (req, res, next) {
    var userid = req.param.userid;
    var name = req.body.name;
    if (name) {
        if (db[userid]) {
            delete db[userid][name];
        }
    } else {
        delete db[userid];
    }
    res.status(200).end();
});

app.use(function (err, req, res, next) {
    if (err) {
        console.error(err.stack);
        res.status(500).json(err).end();
    } else {
        console.error("Error: Resource for " + req.method + " " + req.url + " not found")
        res.status(404).end("Resource for " + req.method + " " + req.url + " not found");
    }
});

app.listen(process.env.PORT || 8080, function () {
    console.log("[Server] listening on port " + this.address().port);
});