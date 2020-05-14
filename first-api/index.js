var express = require('express');
var tediousExpress = require('express4-tedious');
var TYPES = require('tedious').TYPES;

var app = express();
var connection =
{
    "server": "192.168.1.19",
    "authentication": {
        type: "default",
        options: {
            "userName": "sa",
            "password": "_____",
        }
    },
    
    options: { "encrypt": true, "database": "trading" }
};
app.use(function (req, res, next) {
    req.sql = tediousExpress(connection);
    next();
});

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
})

app.get('/contact.html', (req, res) => {
    console.log("Contact made");
    res.send('<h1>This is my contact page</h1>');
})

app.get('/api/symbol', (req, res) => {
    req.sql("select * from Symbol for JSON path").into(res);
})

app.get('/api/symbol/:id', (req, res) => {
    req.sql("select * from Daily where Symbol = @id for JSON path").param('id', req.params.id, TYPES.varchar).into(res);
})

var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
