var url1 = "http://www.forbes.com/sites/alexkonrad/2016/01/29/new-ibm-watson-chief-david-kenny-talks-his-plans-for-ai-as-a-service-and-the-weather-company-sale/";
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
                posts = GetRandomPosts();
                res.send(posts);
            }
            else{
                posts = GetSpecificPost();
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
            nlu.analyze({
                //'url':chunk.toString()[2],
                'url':url1,
                'features': {
                    'categories':{},
                }
            }, function(err, response) {
                if (err)
                    console.log('error:', err);
                else {
                    var options = {
                        url: 'http://bot.bardavidistaken.com/UpdateUserRanks',
                        method: 'POST',
                        form: response
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

function setDb(db) {
    db.collection('pages').insertMany([
        {
            "name": "First Message",
            "massageArr": [
                "Message 1 row 1",
                "Message 1 row 2",
                "Message 1 row 3",
                "Message 1 row 4"
            ],
            "pictureArray": [
                "images/1.jpg",
                "images/2.jpg"
            ],
            "hyperText": "./templateA.html",
            "screenNum":["1","2"],
            "dpage": {
                "fromDate": "2016-01-01",
                "toDate": "2017-01-01",
                "daysToShow":[
                    "4"
                ],
                "TimeShowFrom":"13:00",
                "TimeShowUntil":"20:00",
                "SecondsToShow":"3000"
            }
        },
        {
            "name": "Second Message",
            "massageArr": ["Message 2 row 1","Message 2 row 2","Message 2 row 3","Message 2 row 4","Message 2 row 5",
                "Message 2 row 6","Message 2 row 7","Message 2 row 8","Message 2 row 9","Message 2 row 10"],
            "pictureArray": ["images/2.jpg"],
            "hyperText": "./templateB.html",
            "screenNum":["1","3"],
            "dpage": {
                "fromDate": "2016-03-01",
                "toDate": "2017-05-01",
                "daysToShow":["3"],
                "TimeShowFrom":"10:00",
                "TimeShowUntil":"16:00",
                "SecondsToShow":"3000"
            }
        },
        {
            "name": "Third Message",
            "massageArr": ["Message 3 row 1","Message 3 row 2","Message 3 row 3","Message 3 row 4","Message 3 row 5"],
            "pictureArray": ["images/3.jpg"],
            "hyperText": "./templateA.html",
            "screenNum":["2","3"],
            "dpage": {
                "fromDate": "2016-05-01",
                "toDate": "2017-06-15",
                "daysToShow":["0","1","2","3","4","5","6"],
                "TimeShowFrom":"08:00",
                "TimeShowUntil":"22:00",
                "SecondsToShow":"3000"
            }
        },
        {
            "name": "Fourth Message",
            "massageArr": ["Message 4 row 1","Message 4 row 2"],
            "pictureArray": [],
            "hyperText": "./templateC.html",
            "screenNum":["1"],
            "dpage": {
                "fromDate": "2016-03-29",
                "toDate": "2016-04-15",
                "daysToShow":[
                    "1"
                ],
                "TimeShowFrom":"15:00",
                "TimeShowUntil":"19:00",
                "SecondsToShow":"3000"
            }
        },
        {
            "name": "Fifth Message",
            "massageArr": ["Message 5 row 1","Message 5 row 2","Message 5 row 3","Message 5 row 4","Message 5 row 5","Message 5 row 6","Message 5 row 7"],
            "pictureArray": ["images/4.jpg","images/5.jpg"],
            "hyperText": "./templateB.html",
            "screenNum":["3"],
            "dpage": {
                "fromDate": "2016-03-29",
                "toDate": "2016-04-15",
                "daysToShow":[
                    "1",
                    "2",
                    "3"
                ],
                "TimeShowFrom":"01:00",
                "TimeShowUntil":"23:00",
                "SecondsToShow":"3000"
            }
        }
    ])
}
