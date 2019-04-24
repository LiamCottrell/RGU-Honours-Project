const express = require('express');
const path = require('path');
const _ = require('underscore');
const geodist = require('geodist');
const fs = require('fs');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

console.log('importing data...');
const data = require('./data/export.500000.json');



console.log('Creating ship list');
let shipList = _.countBy(data, function (o) {
    return o.MMSI
});


console.log('Creating Distance list');
// Takes the first and the last known points and calculates the distance apart in miles
const distance = Object.keys(shipList).map(function (name){
    let rows = _.where(data, { MMSI: parseInt(name, 10) });
    let quantityOfPoints = Object.keys(rows).length;
    let firstPoint = {
        lat: Object.values(rows)[0].Latitude,
        lon: Object.values(rows)[0].Longitude,
    };
    let lastPoint = {
        lat: Object.values(rows)[quantityOfPoints-1].Latitude,
        lon: Object.values(rows)[quantityOfPoints-1].Longitude,
    };
    return geodist(firstPoint, lastPoint, {unit: 'miles'});
});

let distanceList = Object.keys(shipList).map(function (name, index) {
    return {
        'MMSI': Object.keys(shipList)[index],
        'qty_locations': Object.values(shipList)[index],
        'distance': Object.values(distance)[index]
    }
});

console.log('Sorting Distance list by distance');
distanceList = _.sortBy(distanceList, function(o) { return o.distance; }).reverse();

console.log('Creating Files for each boat');
Object.keys(shipList).map(function (name){
    let rows = _.where(data, { MMSI: parseInt(name, 10) });
    rows = _.sortBy(rows, function(o) { return o.RecvTime.$date; });
    let json = JSON.stringify(rows);
    fs.writeFile(__dirname + "/data/boats/"+ name +'.json', json, 'utf8', function(err) {
        if (err) throw err;
    });
});

// An api endpoint that returns a short list of items
app.get('/api/getData', (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.json(data);
    console.log('Sent data');
});

// An api endpoint that returns a short list of items
app.get('/api/getData/shipList', (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.json(shipList);
    console.log('Sent shipList');
});

// An api endpoint that returns a short list of items
app.get('/api/getData/distanceList', (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.json(distanceList);
    console.log('Sent distanceList');
});

// An api endpoint that returns a short list of items
app.get('/api/getData/boats/:MMSI', (req,res) => {
    let mmsireq = req.params.MMSI;
    let boatData = require('./data/boats/'+ mmsireq +'.json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.json(boatData);
    console.log('Sent boat: ' + mmsireq);
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);