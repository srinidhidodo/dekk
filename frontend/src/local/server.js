const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const url = require('url');
const request = require('request');

const port = 4300;
const devServer = 'http://localhost:5000';

const app = express();
// app.use(bodyParser.json());

app.get('/api/v1/*', (req, res) => {
    console.log(devServer + req.url);
    req.pipe(request(devServer + req.url)).pipe(res);
});

app.post('/api/v1/*', (req, res) => {
    console.log(devServer + req.url);
    req.pipe(request(devServer + req.url)).pipe(res);
});

app.get('/dekk/tags', (req, res) => {
    const response = require("./mocks/tagsResponse.json");
    res.json(response);
});

app.get('/dekk/cards/*', (req, res) => {
    const response = require("./mocks/cardResponse.json");
    res.json(response);
});

app.get('/dekk/home', (req, res) => {
    console.log(devServer + req.url);
    const response = require("./mocks/homeResponse.json");
    res.json(response);
});

app.get('/dekk/dekk-details*', (req, res) => {
    console.log(devServer + req.url);
    const response = require("./mocks/dekkDetailsResponse.json");
    res.json(response);
});

app.post('/dekk/save', (req, res) => {
    console.log(devServer + req.url);
    res.json('test-dekk-id');
});

app.post('/dekk/savesubdekk', (req, res) => {
    console.log(devServer + req.url);
    const response = require("./mocks/createSubDekkResponse.json");
    res.json(response);
});

app.listen(port, () => {
    console.log('Local server listening at port ' + port);
});