const express = require('express');
const app = express();
const fetch = require('node-fetch');
const apiBaseURL = 'https://wsdot.wa.gov/ferries/api/schedule/rest/schedule/';
const apiKey = 'e1200b52-935e-4ab9-9289-7314a369fbc4';

app.get('/:date/:departing/:arriving', (req, res) => {
    fetch(`${apiBaseURL}/${req.params.date}/${req.params.departing}/${req.params.arriving}?apiaccesscode=${apiKey}`)
    .then(response => response.json())
    .then(data => res.send(data));
});

app.get('/terminals/:date', (req, res) => {
    fetch(`https://wsdot.wa.gov/ferries/api/schedule/rest/terminals/${req.params.date}?apiaccesscode=${apiKey}`)
    .then(response => response.json())
    .then(data => res.send(data));
});

module.exports = app;