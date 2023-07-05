
require('dotenv').config();
const axios = require('axios');
var express = require('express');
var nunjucks = require('nunjucks');

var app = express();

app.use(express.static('assets'));

// Setup nunjucks templating engine
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('port', process.env.PORT || 3000);

// Home page
app.get('/', function (req, res) {
    res.render('index.html', {
        page: 'home',
        port: app.get('port')
    });
});

// Landing page
app.get('/landing', function (req, res) {
    res.render('landing.html', {
        page: 'landing',
        port: app.get('port')
    });
});

// Other example
app.get('/hr-interns', function (req, res) {
    const baseId = process.env.BASE_ID;
    const tableIdOrName = process.env.TABLE_ID;
    const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

    const headers = {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
    };

    axios.get(apiUrl, { headers })
        .then(response => {
            let interns = response.data.records.filter(intern=> intern.fields["Video Link"]);
            res.render('hr-interns.html', {interns});
        })
        .catch(error => {
            console.error(error);
        });
});

// Kick start our server
app.listen(app.get('port'), function () {
    console.log('Server started on port', app.get('port'));
});
