var url1 = "http://www.forbes.com/sites/alexkonrad/2016/01/29/new-ibm-watson-chief-david-kenny-talks-his-plans-for-ai-as-a-service-and-the-weather-company-sale/";
var express = require('express');
var app = express();
var mongo = require('mongodb');
var fs = require('fs');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');


var nlu = new NaturalLanguageUnderstandingV1({
    "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
    "username": "a0d99f7c-28ca-4a7c-a734-213566de6609",
    "password": "1ykRx2byiAps",
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

function NluAnalysisByUrl(url) {
    nlu.analyze({
        'url':url,
        'features': {
            'categories':{},
            'concepts': {},
            'keywords': {},
        }
    }, function(err, response) {
        if (err)
            console.log('error:', err);
        else
            console.log(JSON.stringify(response, null, 2));
    });

}
function NluAnalysisByText(text) {
    nlu.analyze({
        'text':text,
        'features': {
            'categories':{},
            'concepts': {},
            'keywords': {},
        }
    }, function(err, response) {
        if (err)
            console.log('error:', err);
        else
            return(JSON.stringify(response, null, 2));
    });
}

app.get('/', function (req, res) {
    mongo.connect("mongodb://likeithack.herokuapp.com//gal", function(err, db) {
        if(!err) {
            var collection = db.collection('pages');
            collection.find({}).toArray(function (err, items) {
                if(items.length != 0) {
                    res.send(items);
                    //NluAnalysisByUrl(url1);
                }
                else{
                    setDb(db);
                    collection.find({}).toArray(function (err, items) {
                        res.send(JSON.stringify(items));
                        res.end();
                    });
                }
            });
        }
    });
})

app.get('/posts/:uid', function (req, res) {
    userId = req.params.uid;
    res.send(userId);
})

app.get('/action/:uId/posts/:actionId', function (req, res) {
    var data = {
        "params": {
            "userId": req.params.uId,
            "actionId": req.params.actionId
        }
    };
    res.send(data);
})


var server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
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
