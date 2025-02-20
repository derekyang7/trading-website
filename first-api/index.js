var express = require('express');
var tediousExpress = require('express4-tedious');
var TYPES = require('tedious').TYPES;

var app = express();
/**
 * Database connection configuration object.
 *
 * @property {Object} server - The server address.
 * @property {Object} authentication - The authentication details.
 * @property {string} authentication.type - The type of authentication.
 * @property {Object} authentication.options - The authentication options.
 * @property {string} authentication.options.userName - The username for authentication.
 * @property {string} authentication.options.password - The password for authentication.
 * @property {Object} options - Additional connection options.
 * @property {boolean} options.encrypt - Whether to use encryption.
 * @property {string} options.database - The name of the database.
 */

var connection =
{
    "server": "192.168.1.19",
    "authentication": {
        type: "default",
        options: {
            "userName": "sa",
            "password": "___",
        }
    },

    options: { "encrypt": true, "database": "trading" }
};

/**
 * Middleware to attach SQL connection to request object.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

app.use(function (req, res, next) {
    req.sql = tediousExpress(connection);
    next();
});

/**
 * GET request handler for the homepage.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
})

/**
 * GET request handler for the contact page.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/contact.html', (req, res) => {
    console.log("Contact made");
    res.send('<h1>This is my contact page</h1>');
})

/**
 * GET request handler for retrieving all symbols.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/api/symbol', (req, res) => {
    req.sql("select * from Symbol for JSON path").into(res);
})

/**
 * GET request handler for retrieving a symbol by ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/api/symbol/:id', (req, res) => {
    req.sql("select * from Daily where Symbol = @id for JSON path").param('id', req.params.id, TYPES.varchar).into(res);
})

var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
