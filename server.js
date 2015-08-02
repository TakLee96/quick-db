var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var redis = require('redis');
var url = require('url');

var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);

client.on('error', function (err) {
    console.error(err);
});

client.on('ready', function () {
    app.use(function (req, res, next) {
        console.log("[%s] %s -> %s", new Date(), req.method, req.url);
        next();
    });

    app.use(cors());
    app.use(express.static(__dirname));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/:userid', function (req, res, next) {
        var userid = req.params.userid;
        var name = req.query.name;
        client.get(userid + "." + name, function (err, reply) {
            if (err) { 
                next(err);
            } else {
                res.status(200).json(JSON.parse(reply)).end();
            }
        });
        
    });

    app.post('/:userid', function (req, res, next) {
        var userid = req.params.userid;
        var name = req.body.name;
        var obj = req.body.obj;
        
        client.set(userid + "." + name, JSON.stringfiy(obj), function (err) {
            if (err) {
                next(err);
            } else {
                res.status(200).end();
            }
        });
    });
    
    app.delete('/:userid', function (req, res, next) {
        var userid = req.params.userid;
        var name = req.query.name;
        
        client.del(userid + "." + name, function (err) {
            if (err) {
                next(err);
            } else {
                res.status(200).end();
            }
        });
    });

    app.use(function (err, req, res, next) {
        if (err) {
            console.error(err.stack);
            res.status(500).json(err).end();
        }
    });

    app.use(function (req, res, next) {
        console.error("Error: Resource for " + req.method + " " + req.url + " not found")
        res.status(404).end("Resource for " + req.method + " " + req.url + " not found");
    });

    app.listen(process.env.PORT || 8080, function () {
        console.log("[Server] listening on port " + this.address().port);
    });
});
