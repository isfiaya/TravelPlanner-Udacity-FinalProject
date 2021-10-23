const path = require('path')
require('dotenv').config()
// Setup empty JS object to act as endpoint for all routes

let projectData = '';

// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();

/* Middleware*/

//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));



// Routes
//GET Route
// app.get('/', async (req, res) => {
//   res.sendFile(path.resolve('src/client/views/index.html'))
// })

app.get('/all', async (req, res) => {
  res.send(projectData)
})

app.get('/key', async (req, res) => {
  res.send({
    geoUserName: process.env.USERNAME_GEONAMES,
    apiKeyWeatherBit: process.env.API_KEY_WEATHERBIT,
    apiKeyPixaBay: process.env.API_KEY_PIXABAY
  })
})

// POST Route
app.post('/add', (req, res) => {
  projectData = {
    temp: req.body.temp,
    humidity: req.body.humidity,
    WindSpeed: req.body.WindSpeed,
    date: req.body.date,
    feel: req.body.feel
  }
  res.send({
    message: "post received successfully!",
    projectData: projectData
  })
})




// Setup Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});