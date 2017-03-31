var url1 = "http://www.forbes.com/sites/alexkonrad/2016/01/29/new-ibm-watson-chief-david-kenny-talks-his-plans-for-ai-as-a-service-and-the-weather-company-sale/";
var url2 = "http://www.nana.co.il"
var express = require('express');
var request = require('request');
var app = express();
var cors = require('cors');
var fs = require('fs');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var http = require('http');


var nlu = new NaturalLanguageUnderstandingV1({
    "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
    "username": "a0d99f7c-28ca-4a7c-a734-213566de6609",
    "password": "1ykRx2byiAps",
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use(cors());

app.get('/', function (req, res) {

})

app.get('/test', function (req, res) {
    var data = {
        "params": {
            "userId": 123,
            "urlId": 456,
            "eventId": 789
        }
    };
    res.send(data);
})

app.get('/posts/:uid', function (req, res) {
    var userId = req.params.uid;
    var top = [];
    var posts = [];
    http.get('http://bot.bardavidistaken.com/GetTop3User/'+userId, function(resp){
        resp.on('data', function(chunk){
            top = chunk.toString();
            if(top.length == 0){//New User
                //posts = GetRandomPosts();
                res.send(posts);
            }
            else{
                //posts = GetSpecificPost();
                res.send(posts);
            }
        });
    }).on("error", function(e){
        console.log("Got error: " + e.message);
    });
})
//GetUrl---------------------------GetUrl----http://bot.bardavidistaken.com/GetUrl/
app.get('/posts/:uId/uurl/:urlId/event/:eventId', function (req, res) {
    res.send("123");
    var uId = req.params.uId;
    var urlId = req.params.urlId;
    var eventId = req.params.eventId;
    http.get('http://bot.bardavidistaken.com/GetUrl/'+uId+'_'+urlId+'_'+eventId, function(resp){
        resp.on('data', function(chunk){
            arr = chunk.toString().split('"');
            nlu.analyze({
                'url':arr[1].toString(),
                'features': {
                    'categories':{},
                }
            }, function(err, response) {
                if (err)
                    console.log('error:', err);
                else {
                    var options = {
                        url: 'http://bot.bardavidistaken.com/UpdateUserRanks/',
                        method: 'POST',
                        form: JSON.stringify(response, null, 2)
                    }
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // Print out the response body
                            console.log(body)
                        }
                    })
                }
            });
        });
    }).on("error", function(e){
        console.log("Got error: " + e.message);
    });
})

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Example app listening at %s",  port)
})
