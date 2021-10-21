const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 4300;

const app = express();
app.use(bodyParser.json());

app.get('/dekk/tags', (req, res) => {
    const response = require("./mocks/tagsResponse.json");
    res.json(response);
});

app.post('/dekk/search', (req, res) => {
    const response = require("./mocks/searchResponse.json");
    res.json(response);
});

app.listen(port, () => {
    console.log('Local server listening at port ' + port);
});