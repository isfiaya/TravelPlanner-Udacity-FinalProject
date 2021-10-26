// SELECTORS
const btnGenerate = document.getElementById('generate')
const startDate = document.getElementById('start__date')
const endDate = document.getElementById('end__date')
const city = document.getElementById('city')
// GLOBAL VARIABLE FOR THE API KEYS
let username = '';
let apiKeyWeatherBit = '';
let apiKeyPixBay = ''
//  GLOBAL VARIABLE
let weatherBitMatchDay = ''
let responseGeo = ''
let tripImg = ''
// Set date input field's min date today AND MAX DATE 15 DAYS 
const maxDate = new Date(new Date().getTime() + (15 * 24 * 60 * 60 * 1000));
startDate.min = new Date().toLocaleDateString('en-ca')
startDate.max = maxDate.toLocaleDateString('en-ca')
endDate.max = startDate.max = maxDate.toLocaleDateString('en-ca')
// RESQUEST TO THE SERVER TO GET API KEYS
const apiKeys = async () => {
  try {
    const response = await fetch('https://travel-planner-udacity.herokuapp.com/key')
    const data = await response.json()
    username = await data.geoUserName
    apiKeyWeatherBit = await data.apiKeyWeatherBit
    apiKeyPixBay = await data.apiKeyPixaBay
  }
  catch (err) {
    console.log(err)
  }
}
// GEONAMES API REQUEST
const geoName = async () => {
  const response = await fetch(`http://api.geonames.org/searchJSON?q=${city.value}&maxRows=1&username=${username}`)
  const data = await response.json()
  try {
    if (data.geonames[0].name.toLowerCase() === city.value.toLowerCase()) {
      responseGeo = {
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng,
        geoCountry: data.geonames[0].countryName,
        geoName: data.geonames[0].name
      }
      console.log(data)
      return responseGeo
    }
    else {
      throw new Error('handled')
    }
  }
  catch (err) {
    alert('Make sure to enter the correct city!')
    throw new Error('handled')
  }
}
// WEATHERBIT API REQUEST
const weatherBit = async (data) => {
  try {
    if (data) {
      const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${data.latitude}&lon=${data.longitude}&key=${apiKeyWeatherBit}`)
      const weatherBit = await response.json()
      const weatherBitData = await weatherBit.data
      // FILTER DATA ACCORDING THE DATE THAT USER INPUT
      weatherBitMatchDay = await weatherBitData.filter(day => day.datetime === startDate.value)
      console.log(weatherBitMatchDay)
    }
  }
  catch (err) {
    console.log(err)
    return false
  }
}
// PIXABAY API REQUEST 
const pixaBay = async () => {
  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKeyPixBay}&q=${responseGeo.geoName}&image_type=photo&pretty=true&category=places`)
    const data = await response.json()
    const bgImg = await data.hits[0]
    tripImg = await bgImg
  }
  catch (err) {
    return false
  }
}
// ENABLE INPUT END DATE WHEN USER INPUT START DATE
startDate.addEventListener('change', (e) => {
  endDate.disabled = false
  //SET MIN INPUT END DATE BASED TO START DATE 
  endDate.min = e.target.value
  endDate.value = ''
})
// HANDUL SUBMIT
btnGenerate.addEventListener('click', (e) => {
  e.preventDefault()
  if (!startDate.value || !city.value) {
    alert('Please make sure all fields are filled in correctly! ')
    return
  }
  apiKeys()
    .then(() => geoName())
    .then(result => weatherBit(result))
    .then(() => pixaBay())
    .then(() => {
      const data = {
        Country: responseGeo.geoCountry,
        City: responseGeo.geoName,
        weatherBitMatchDay: weatherBitMatchDay,
        tripImg: tripImg,
        dateDeff: Client.dateDiffInDays()
      }
      localStorage.setItem('data', JSON.stringify(data));
    })
    .then(() => Client.updateUi())
    .then(() => {
      //RESET INPUT
      city.value = ''
      startDate.value = ''
      endDate.value = ''
      endDate.disabled = true
    })
})
export { geoName, pixaBay, weatherBit, apiKeys }