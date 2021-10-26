const path = require('path');
const express = require("express");
const cors = require('cors');
require('dotenv').config()
const app = express();
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

/* Middleware*/
// Initialize the main project folder
app.use(express.static('dist'));
// Routes
//GET Route
// app.get('/', async (req, res) => {
//   res.sendFile(path.resolve('src/client/views/index.html'))
// })

app.get('/', function (req, res) {
  res.sendFile('dist/index.html');
})

app.get('/key', async (req, res) => {
  res.send({
    geoUserName: process.env.USERNAME_GEONAMES,
    apiKeyWeatherBit: process.env.API_KEY_WEATHERBIT,
    apiKeyPixaBay: process.env.API_KEY_PIXABAY
  })
})
app.get('/test', async (req, res) => {
  res.json({ msg: 'pass!' })
})


// Setup Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app