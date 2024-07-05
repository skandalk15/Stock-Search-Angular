var express = require('express');
var cors = require('cors');
var path = require('path')
var XMLHttpRequest = require('xhr2');
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios')
const app = express();

const APIKeyFinnHubKartik = "cmu14rpr01qsv99lsme0cmu14rpr01qsv99lsmeg"
const APIKeyPolygon="344thCDJXZjJwP8IaEuZLBgu5zj7e5dF"

// KP
const finnhub = require('finnhub');
const bodyParser = require('body-parser');

var jsonParser = bodyParser.json()

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = APIKeyFinnHubKartik
const finnhubClient = new finnhub.DefaultApi()



const uri = "mongodb+srv://samarthamahesh:csci_password@cluster0.wssiveg.mongodb.net/?retryWrites=true&w=majority";
const dbName = "HW3";
const collectionName = "storage"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
});

app.use(express.static(path.join(__dirname, 'dist/')));
app.use(cors({credentials: true, origin: true}));


// Company's Overview - Checked
app.get('/apis/stocks/overview', function (req, res) {
    let params = req.query;

    finnhubClient.companyProfile2({ 'symbol': params.ticker }, (error, data, response) => {

        //      Difference - endDate,description
        data['description'] = ''
        data['exchangeCode'] = data['exchange']
        data['startDate'] = data['ipo']

        res.json(data)

    });
});

// Company's lastChartPrices - Checked
app.get('/apis/stocks/lastChartPrices', function (req, res) {

    let params = req.query;
    let toDate = params.timestamp.slice(0, 10)
    let fromDate = getDateInThePastFrom(1, 0, 0, toDate)

    let resolution = '5'
    var unixTimestamp_fromDate = Math.floor(new Date(fromDate).getTime() / 1000);

    // var unixTimestamp_toDate = Math.floor(new Date(toDate).getTime() / 1000);
    console.log(fromDate, toDate)
    console.log("https://api.polygon.io/v2/aggs/ticker/"+params.ticker+"/range/1/hour/"+fromDate+"/"+toDate+"?adjusted=true&sort=asc&apiKey=344thCDJXZjJwP8IaEuZLBgu5zj7e5dF")
    axios.get("https://api.polygon.io/v2/aggs/ticker/"+params.ticker+"/range/1/hour/"+fromDate+"/"+toDate+"?adjusted=true&sort=asc&apiKey=344thCDJXZjJwP8IaEuZLBgu5zj7e5dF")
        .then(response => {
            var data = response.data.results;
            console.log(data)
            let res_data = []
        
            try {
                for (let i = 0; i < data.length; i++) {
                    let res1 = []
                    // let res2 = []
                    // console.log(data[i]['t'] * 1000 - 28800000, "SS", typeof(data[i]['t']))
                    
                    // var date = new Date(data[i]['t'])
                    // // Generate date string
                    // console.log(date.toLocaleDateString("en-US"));   // Prints: 5/6/2022
                    // console.log(date.toLocaleDateString("en-GB"));   // Prints: 06/05/2022
                    // console.log(date.toLocaleDateString("default")); // Prints: 5/6/2022

                    // // Generate time string
                    // console.log(date.toLocaleTimeString("en-US"));   // Prints: 1:10:34 PM
                    // console.log(date.toLocaleTimeString("it-IT"));   // Prints: 13:10:34
                    // console.log(date.toLocaleTimeString("default")); // Prints: 1:10:34 PM


    
                    res1.push(data[i]['t']); //making it milliseconds and pacific time
                    // res1.push(data[i]['o']);
                    // res1.push(data[i]['h']);
                    // res1.push(data[i]['l']);
                    res1.push(data[i]['c']);
                    // responseOhlc.push(res1);
                    // res2.push(data[i]['t'] * 1000);
                    // res2.push(data[i]['v']);
                    // responseVol.push(res2);
                    res_data.push(res1)
                }
    
                // res_data["ohlc"] = responseOhlc;
                // res_data["volume"] = responseVol;
                // res_data.reverse()
    
                res.json(res_data.slice(-70))
            }
            catch (e) {
                res.json()
            }
        })



    // finnhubClient.stockCandles(params.ticker, resolution, unixTimestamp_fromDate, toDate, (error, data, response) => {
    //     //      console.log(data)
    //     let res_data = []
    //     // let responseOhlc = []
    //     // let responseVol = []

    //     try {
    //         for (let i = 0; i < data['t'].length; i++) {
    //             let res1 = []
    //             // let res2 = []

    //             res1.push(data['t'][i] * 1000 - 28800000); //making it milliseconds and pacific time
    //             // res1.push(data['o'][i]);
    //             // res1.push(data['h'][i]);
    //             // res1.push(data['l'][i]);
    //             res1.push(data['c'][i]);
    //             // responseOhlc.push(res1);
    //             // res2.push(data['t'][i] * 1000);
    //             // res2.push(data['v'][i]);
    //             // responseVol.push(res2);
    //             res_data.push(res1)
    //         }

    //         // res_data["ohlc"] = responseOhlc;
    //         // res_data["volume"] = responseVol;
    //         // res_data.reverse()

    //         res.json(res_data.slice(-70))
    //     }
    //     catch (e) {
    //         res.json()
    //     }
    // });

});

// Company's Quotes - Checked
app.get('/apis/stocks/quotes', function (req, res) {

    let params = req.query;

    var oReq = new XMLHttpRequest();
    oReq.open("GET", 'https://finnhub.io/api/v1/quote?symbol=' + params.ticker + '&token=' + APIKeyFinnHubKartik);

    oReq.onload = function () {
        let data = JSON.parse(oReq.response);

        data['high'] = data['h']
        data['open'] = data['o']
        data['low'] = data['l']
        data['askPrice'] = data['c']
        data['last'] = data['c']
        data['prevClose'] = data['pc']
        data['change'] = data['d']
        data['changePercentage'] = data['dp']
        data['ticker'] = params.ticker
        data['timestamp'] = data['t']

        data['humantimestamp'] = new Date(data['t'] * 1000)
        // console.log(data['humantimestamp'])

        let currentTime = new Date().getTime();

        let lastTime = new Date(data['t']).getTime() * 1000;

        let seconds = Math.abs(currentTime - lastTime) / 1000;

        if (seconds >= 300) {
            data['marketOpen'] = false;

        }
        else {
            data['marketOpen'] = true;
        }

        let resArray = []
        resArray.push(data)

        res.json(resArray)

    };

    oReq.send();
});


function getDate(yearsAgo = 0, monthsAgo = 0, daysAgo = 0) {
    let date_ob = new Date();

    let date = ("0" + (date_ob.getDate() - daysAgo)).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1 - monthsAgo)).slice(-2);
    let year = date_ob.getFullYear() - yearsAgo;
    return `${year}-${month}-${date}`;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

function getDateInThePast(days, months, years) {
    const currentDate = new Date();
    
    // Subtract the desired number of days, months, and years
    currentDate.setDate(currentDate.getDate() - days);
    currentDate.setMonth(currentDate.getMonth() - months);
    currentDate.setFullYear(currentDate.getFullYear() - years);
  
    return formatDate(currentDate);
}

function getDateInThePastFrom(days, months, years, datestamp) {
    comps = datestamp.split("-")
    syear = comps[0]
    smonth = String(parseInt(comps[1])-1)
    sday = comps[2]

    const currentDate = new Date(syear, smonth, sday);
    
    // Subtract the desired number of days, months, and years
    currentDate.setDate(currentDate.getDate() - days);
    currentDate.setMonth(currentDate.getMonth() - months);
    currentDate.setFullYear(currentDate.getFullYear() - years);
  
    return formatDate(currentDate);
}
  

function unixToHumanDate(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    return `${date}-${month}-${year}`
}

// History - Checked
app.get('/apis/stocks/history', function (req, res) {
    let params = req.query;
    let fromDate = getDate(2)
    let toDate = getDate(0)
    let resolution = 'D'
    var unixTimestamp_fromDate = Math.floor(new Date(fromDate).getTime() / 1000);


    var unixTimestamp_toDate = Math.floor(new Date(toDate).getTime() / 1000);
    // console.log(params.ticker)

    axios.get("https://api.polygon.io/v2/aggs/ticker/"+params.ticker+"/range/1/day/"+fromDate+"/"+toDate+"?adjusted=true&sort=asc&apiKey=344thCDJXZjJwP8IaEuZLBgu5zj7e5dF")
        .then(response => {
            var data = response.data.results;

            let res_data = { 'ohlc': [], 'volume': [] }
            let responseOhlc = []
            let responseVol = []
        
            try {
                for (let i = 0; i < data.length; i++) {
                    let res1 = []
                    let res2 = []
                    res1.push(data[i]['t']);
                    res1.push(data[i]['o']);
                    res1.push(data[i]['h']);
                    res1.push(data[i]['l']);
                    res1.push(data[i]['c']);
                    responseOhlc.push(res1);
                    res2.push(data[i]['t']);
                    res2.push(data[i]['v']);
                    responseVol.push(res2);
                }
    
                res_data["ohlc"] = responseOhlc;
                res_data["volume"] = responseVol;
                
                res.json(res_data)
    
            }
            catch (exception) {
                res.json()
            }
        })
    

    // finnhubClient.stockCandles(params.ticker, resolution, unixTimestamp_fromDate, unixTimestamp_toDate, (error, data, response) => {
    //     let res_data = { 'ohlc': [], 'volume': [] }
    //     let responseOhlc = []
    //     let responseVol = []

    //     try {


    //         for (let i = 0; i < data['o'].length; i++) {
    //             let res1 = []
    //             let res2 = []

    //             res1.push(data['t'][i] * 1000);
    //             res1.push(data['o'][i]);
    //             res1.push(data['h'][i]);
    //             res1.push(data['l'][i]);
    //             res1.push(data['c'][i]);
    //             responseOhlc.push(res1);
    //             res2.push(data['t'][i] * 1000);
    //             res2.push(data['v'][i]);
    //             responseVol.push(res2);
    //         }

    //         res_data["ohlc"] = responseOhlc;
    //         res_data["volume"] = responseVol;

    //         res.json(res_data)

    //     }
    //     catch (exception) {
    //         res.json()
    //     }

    // });
});


// Autocomplete - Checked
app.get('/apis/stocks/autocomplete', function (req, res) {
    let params = req.query;

    finnhubClient.symbolSearch(params.query, (error, data, response) => {
        let resArray = data['result']
        let newArray = resArray.filter(element => !(element['symbol'].includes('.')))

        newArray.forEach((prediction) => {

            prediction['ticker'] = prediction['symbol']
        }
        )
        res.json(newArray)
    });

});

//News - Checked
app.get('/apis/stocks/news/', function (req, res) {
    let params = req.query;

    let fromDate = getDateInThePast(7, 0, 0).slice(0, 10)
    let toDate = getDate()

    //    YYYY-MM-DD - params.fromDate, params.toDate
    finnhubClient.companyNews(params.ticker, fromDate, toDate, (error, data, response) => {

        //        console.log(data)
        data = data.filter(item => (item['image'] != ""))
        for (let i = 0; i < data.length; i++) {
            data[i]['title'] = data[i]['headline']
            data[i]['description'] = data[i]['summary']

            //            Content Unavaliable
            data[i]['content'] = data[i]['summary']
            data[i]['publishedAt'] = unixToHumanDate(data[i]['datetime'])
        }

        res.json(data.slice(0, 20))
    });
});

//------------------------------------NEW FEATURES ---------------------------------------------
//Recommendation - Checked
app.get('/apis/stocks/recommendation', function (req, res) {
    let params = req.query;


    finnhubClient.recommendationTrends(params.ticker, (error, data, response) => {
        //      console.log(data)
        res.json(data)

    });
});

//Sentiment - Checked
app.get('/apis/stocks/sentiment', function (req, res) {
    let params = req.query;

    var oReq = new XMLHttpRequest();

    oReq.open('GET', 'https://finnhub.io/api/v1/stock/insider-sentiment?symbol=' + params.ticker + '&from=2022-01-01' + '&token=' + APIKeyFinnHubKartik);
    oReq.onload = function () {
        let data = JSON.parse(oReq.response);
        res.json(data)
    }
    oReq.send();
});

//Company Peers - Checked
app.get('/apis/stocks/companypeers', function (req, res) {
    let params = req.query;

    finnhubClient.companyPeers(params.ticker, (error, data, response) => {
        //        console.log(data)
        data = data.filter(element => !(element.includes('.')))
        res.json(data)
    });
});

//Company Earning - Checked
app.get('/apis/stocks/companyearning', function (req, res) {
    let params = req.query;

    finnhubClient.companyEarnings(params.ticker, { 'limit': 20 }, (error, data, response) => {

        res.json(data)
    });
});



app.get('/apis/stocks/watchlist', async function (req, res) {
    const client = new MongoClient(uri);

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    var retArray = [];

    try {
        const allItems = await collection.findOne({"name": "watchlist"});
        var watchlist = String(allItems.watchlist);
        // for (var item in allItems) {
        //     retArray.push(allItems[item].value)
        // }
    } catch (err) {
        console.log(err);
    }

    await client.close()
    res.send(watchlist);
})

app.post('/apis/stocks/updateWatchlist', jsonParser, async function (req, res) {
    const client = new MongoClient(uri);

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    var retArray = [];

    try {
        const filter = { "name": "watchlist" };
        const options = { upsert: true }
        const updateDoc = {
            $set: {
                watchlist: req.body["watchlist"]
            }
        };

        const result = await collection.updateOne(filter, updateDoc, options)
        // const allItems = await collection.find({}).toArray();
        // var money = String(allItems[0].money)
        // for (var item in allItems) {
        //     console.log(item, allItems[item])
        //     retArray.push(allItems[item].value)
        // }
    } catch (err) {
        console.log(err);
    }

    await client.close()
    res.send({"msg": "Successfully updated"});
})

app.get('/apis/stocks/portfolio', async function (req, res) {
    const client = new MongoClient(uri);

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    var retArray = [];

    try {
        const allItems = await collection.findOne({"name": "portfolio"});
        var portfolio = String(allItems.portfolio)
        // for (var item in allItems) {
        //     retArray.push(allItems[item].value)
        // }
    } catch (err) {
        console.log(err);
    }

    await client.close()
    res.send(portfolio);
})

app.post('/apis/stocks/updatePortfolio', jsonParser, async function (req, res) {
    const client = new MongoClient(uri);

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    var retArray = [];

    try {
        const filter = { "name": "portfolio" };
        const options = { upsert: true }
        const updateDoc = {
            $set: {
                portfolio: req.body["portfolio"]
            }
        };

        const result = await collection.updateOne(filter, updateDoc, options)
        // const allItems = await collection.find({}).toArray();
        // var money = String(allItems[0].money)
        // for (var item in allItems) {
        //     console.log(item, allItems[item])
        //     retArray.push(allItems[item].value)
        // }
    } catch (err) {
        console.log(err);
    }

    await client.close()
    res.send({"msg": "Successfully updated"});
})

app.get('/apis/stocks/wallet/balance', async function (req, res) {
    const client = new MongoClient(uri);

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    var retArray = [];

    try {
        const allItems = await collection.findOne({"name": "money"});
        var money = String(allItems.money)
        // for (var item in allItems) {
        //     console.log(item, allItems[item])
        //     retArray.push(allItems[item].value)
        // }
    } catch (err) {
        console.log(err);
    }

    await client.close()
    res.send(money);
})

app.post('/apis/stocks/wallet/updateBalance', jsonParser, async function (req, res) {
    const client = new MongoClient(uri);

    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    var retArray = [];


    try {
        const filter = { "name": "money" };
        const options = { upsert: true }
        const updateDoc = {
            $set: {
                money: req.body["money"]
            }
        };

        const result = await collection.updateOne(filter, updateDoc, options)
        // const allItems = await collection.find({}).toArray();
        // var money = String(allItems[0].money)
        // for (var item in allItems) {
        //     console.log(item, allItems[item])
        //     retArray.push(allItems[item].value)
        // }
    } catch (err) {
        console.log(err);
    }

    await client.close()
    res.send({"msg": "Successfully updated"});
})



app.use("*", function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})


if (module === require.main) {
    // Start the server
    let server = app.listen(process.env.port || 8080, function () {
        let port = server.address().port;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = false;
        console.log('App listening on port %s', port);
        console.log('Press Ctrl+C to quit.');
    });
}

module.exports = app;

// // Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
//     console.log('Press Ctrl+C to quit.');
// });

// module.exports = app;
