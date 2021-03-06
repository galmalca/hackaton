var url1 = "http://www.forbes.com/sites/alexkonrad/2016/01/29/new-ibm-watson-chief-david-kenny-talks-his-plans-for-ai-as-a-service-and-the-weather-company-sale/";
var express = require('express');
var request = require('request');
var app = express();
var cors = require('cors');
var fs = require('fs');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var http = require('http');
var router = express.Router();
var axios = require('axios');


function getJsonByCat(arr){
    var existImg = Array();
    arr.posts.forEach(function(post) {
        if(post.thread.main_image != ''){
            existImg.push(post);
        }
    }, this);


    var randomPosts = [

        {
            uuid: existImg[0].thread.uuid,
            url: existImg[0].thread.url,
            title: existImg[0].thread.title,
            main_image: existImg[0].thread.main_image
        },

        {
            uuid: existImg[1].thread.uuid,
            url: existImg[1].thread.url,
            title: existImg[1].thread.title,
            main_image: existImg[1].thread.main_image
        },

        {
            uuid: existImg[2].thread.uuid,
            url: existImg[2].thread.url,
            title: existImg[2].thread.title,
            main_image: existImg[2].thread.main_image
        },

        {
            uuid: existImg[3].thread.uuid,
            url: existImg[3].thread.url,
            title: existImg[3].thread.title,
            main_image: existImg[3].thread.main_image
        },

        {
            uuid: existImg[4].thread.uuid,
            url: existImg[4].thread.url,
            title: existImg[4].thread.title,
            main_image: existImg[4].thread.main_image
        },

    ];

    return randomPosts;
}

function rand3Category(){
    var categoryArr = Array("shopping", "sports" , "games", "finance", "social", "health", "tech", "travel", "humor", "education", "business", "foos", "jobs", "media", "entertainment");
    var randCats = [];
    var rand1 = categoryArr[Math.floor(Math.random() * categoryArr.length)];
    var rand2 = categoryArr[Math.floor(Math.random() * categoryArr.length)];
    var rand3 = categoryArr[Math.floor(Math.random() * categoryArr.length)];

    while((rand1 ==rand2) || (rand1 ==rand3) || (rand2 ==rand3) ){
        rand2 = categoryArr[Math.floor(Math.random() * categoryArr.length)];
        rand3 = categoryArr[Math.floor(Math.random() * categoryArr.length)];
    }
    randCats.push(rand1);
    randCats.push(rand2);
    randCats.push(rand3);
    return randCats;
}

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
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('/views/index.html');
});

app.get('/test', function (req, res) {
    var data = {
        "data": [
        {
            "id": "X999_Y999",
            "from": {
                "name": "Tom Brady", "id": "X12"
            },
            "message": "Looking forward to 2010!",
            "actions": [
                {
                    "name": "Comment",
                    "link": "http://www.facebook.com/X999/posts/Y999"
                },
                {
                    "name": "Like",
                    "link": "http://www.facebook.com/X999/posts/Y999"
                }
            ],
            "type": "status",
            "created_time": "2010-08-02T21:27:44+0000",
            "updated_time": "2010-08-02T21:27:44+0000"
        },
        {
            "id": "X998_Y998",
            "from": {
                "name": "Peyton Manning", "id": "X18"
            },
            "message": "Where's my contract?",
            "actions": [
                {
                    "name": "Comment",
                    "link": "http://www.facebook.com/X998/posts/Y998"
                },
                {
                    "name": "Like",
                    "link": "http://www.facebook.com/X998/posts/Y998"
                }
            ],
            "type": "status",
            "created_time": "2010-08-02T21:27:44+0000",
            "updated_time": "2010-08-02T21:27:44+0000"
        }
    ]
    }
    res.send(data);
})

app.get('/posts/:uid', function (req, res) {
    var userId = req.params.uid;
    var arrRandom = new Array();
    arrRandom = rand3Category();

    var top = [];
    var posts = [];
    http.get('http://bot.bardavidistaken.com/GetTop3User/'+userId, function(resp){
        resp.on('data', function(chunk){
            console.log(chunk.toString());
            top = JSON.parse(chunk.toString());
            console.log(top);
            if(top[1].length == 0){//New User
                var Custom2API = 'https://webhose.io/search?token=b4bb7c39-a19e-4736-9673-d99e32e3375a' + '&format=json&q=' +
                    '(' + arrRandom[0] +'%20OR%20' + arrRandom[1] + '%20OR%20' + arrRandom[2] + ')&sort=rating';
                var arr1 = [];
                    axios.get(Custom2API)
                        .then(function (response) {
                            arr1 = response.data;
                            //console.log(getJsonByCat(arr1));
                            dat = getJsonByCat(arr1);
                            res.send(dat);
                            var options = {
                                url: 'http://bot.bardavidistaken.com/InsertNewUrl/',
                                method: 'POST',
                                form: JSON.stringify(dat, null, 2)
                            }
                            request(options, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    // Print out the response body
                                    console.log(body)
                                }
                            })
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
            }
            else{
                cat1 = top[1][0];
                cat2 = top[1][1];
                cat3 = top[1][2];
                var Custom2API = 'https://webhose.io/search?token=b4bb7c39-a19e-4736-9673-d99e32e3375a' +
                    '&format=json&q=(' + cat1 +'%20OR%20' + cat2 + '%20OR%20' + cat3 + ')&sort=rating'
                axios.get(Custom2API)
                    .then(function (response) {
                        arr1 = response.data;
                        dat = getJsonByCat(arr1);
                        res.send(dat);
                        var options = {
                            url: 'http://bot.bardavidistaken.com/InsertNewUrl/',
                            method: 'POST',
                            form: JSON.stringify(dat, null, 2)
                        }
                        request(options, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                // Print out the response body
                                console.log(body)
                            }
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    }).on("error", function(e){
        console.log("Got error: " + e.message);
    });
});

//GetUrl---------------------------GetUrl----http://bot.bardavidistaken.com/GetUrl/
app.get('/posts/:uId/uurl/:urlId/event/:eventId', function (req, res) {
    //res.send("123");
    var uId = req.params.uId;
    var urlId = req.params.urlId;
    var eventId = req.params.eventId;
    http.get('http://bot.bardavidistaken.com/GetUrl/'+uId+'_'+urlId+'_'+eventId, function(resp){
        resp.on('data', function(chunk){
            arr = chunk.toString();
            x = JSON.parse(arr);
            console.log(x);
            nlu.analyze({
                //'url':"https://www.yahoo.com/news/first-lady-melania-trump-makes-144507169.html",
                'url':arr[3],
                'features': {
                    'categories':{}
                }
            }, function(err, response) {
                if (err)
                    console.log('error:', err);
                else {
                    response.uId = uId;
                    response.eventId = eventId;
                    var options = {
                        url: 'http://bot.bardavidistaken.com/UpdateUserRanks/',
                        method: 'POST',
                        form: JSON.stringify(response, null, 2)
                        //form: uId+urlId,
                    };
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
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Example app listening at %s",  port)
});

module.exports = router;