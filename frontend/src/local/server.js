const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const url = require('url');
const request = require('request');

const port = 4300;
const devServer = 'http://localhost:5000';

const app = express();
app.use(bodyParser.json());

app.get('/dekk/tags', (req, res) => {
    const response = require("./mocks/tagsResponse.json");
    res.json(response);
});

app.get('/dekk/cards/*', (req, res) => {
    const response = require("./mocks/cardResponse.json");
    res.json(response);
});

app.get('/api/v1/*', (req, res) => {
    // const response = require("./mocks/searchResponse.json");
    // res.json(response);
    console.log(devServer + req.url);
    // req.pipe(request(devServer + req.url)).pipe(res);
    setTimeout(() => {
        req.pipe(request(devServer + req.url)).pipe(res);
    }, 1000);
});

app.get('/dekk/home', (req, res) => {
    const response = require("./mocks/homeResponse.json");
    res.json(response);
});

app.listen(port, () => {
    console.log('Local server listening at port ' + port);
});