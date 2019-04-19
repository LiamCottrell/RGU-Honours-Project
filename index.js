const express = require('express');
const path = require('path');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getData', (req,res) => {
    const data = require('./data/export.10000.json');
    // var list = ["item1", "item2", "item3"];
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.json(data);
    console.log('Sent data');
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);