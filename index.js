const express = require('express')
const CSVToJSON = require('csvtojson');
const PORT = process.env.PORT || 5003
const getPositions = require('./getPositions');
const setVariableInterval = require('./setVariableInterval');

const app = express(); //Line 2
const path = __dirname + '/public/views/';

setVariableInterval(() => { getPositions() }, 30);

app.use(express.static(path));
// app.get('/', (req, res) => res.render('index.html'));

app.get('/', function (req, res) {
  res.sendFile(path + "index");
});

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11

app.get('/api/positionsData', async (req, res) => {
  CSVToJSON().fromFile('positions.csv')
    .then(positions => {
      res.send(
        positions.map(row => {
          return {
            "timestamp": parseInt(row['timestamp']),
            "shortLongDiff": parseInt(row['shortLongDiff']),
            "shortVolume": parseInt(row['shortVolume']),
            "longVolume": parseInt(row['longVolume']),
            "ethPrice": !!row['ethPrice'] ? parseInt(row['ethPrice']) : null
          }
        })
      );
    }).catch(err => {
      // log error if any
      console.log(err);
    });
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
