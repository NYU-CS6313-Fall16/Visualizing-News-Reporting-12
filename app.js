var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Articles = require('./article');

var hostname = '127.0.0.1';
var port = 3000;

var app = express();
var dataRouter;
var url = 'mongodb://localhost:27017/news';
//var url = 'mongodb://infovis:YIdFUZMcbnUZZAGZvOcvTCdgqSrJbTUYQPSWwklKtzVMDAv6SEFKkGtmoK1CGNG1iN1Rpi6YMWgSQFaJ1YSS5g==@infovis.documents.azure.com:10250/news_v2/?ssl=true';
var db;

//-----connect to MongoDB---------//
mongoose.connect(url);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to MongoDB");
});

//------set up router response-----//
app.use(express.static(__dirname));

dataRouter = express.Router();
dataRouter.use(bodyParser.json());

dataRouter.route('/website/:name/:startTime/:endTime')
.get(function (req, res) {
    Articles.find(
        {'website': req.params.name,
            'first_mention': true,
            "time": {"$gte": new Date(req.params.startTime), "$lt": new Date(req.params.endTime)}}, function (err, article) {
        if (err) throw err;
        res.json(article);
    });   
});

dataRouter.route('/website/:name')
.get(function (req, res) {
    Articles.find({'website': req.params.name, 'first_mention': true}, function (err, article) {
        if (err) throw err;
        res.json(article);
    });   
});

dataRouter.route('/all/:itemName')
.get(function (req, res) {
    Articles.distinct(req.params.itemName, function (err, items) {
        if (err) throw err;
        res.json(items);
    });
});

//-----load static index page

app.get('/', function(req, res, next) {
    console.log('Router Succeed!')
    console.log('Redirect to index.html!')
    res.sendFile(__dirname + "/" + "index.html");
});

app.use('/data',dataRouter);

app.listen(port, hostname, function(){
  console.log('Server running');
});
// app.listen(port, function(){
//   console.log(`Server running at http://${hostname}:${port}/`);
// });