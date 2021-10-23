// SELECTORS
const btnGenerate = document.getElementById('generate')
const date = document.getElementById('date')
const city = document.getElementById('city')
const entryCountry = document.getElementById('entry__country')
const entryCity = document.getElementById('entry__city')
const entryImg = document.getElementById('entry__img')
const entryDeparting = document.getElementById('entry__departing')
const entryHighTemp = document.getElementById('entry__high__temp')
const entryLowTemp = document.getElementById('entry__low__temp')
const tempDesc = document.getElementById('temp__desc')
const tempIcon = document.getElementById('temp__icon')
// URL IMAGE IF pixaBay NOT FOUND IMAGE
const UrlImageNoAvailable = 'https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/no-image.png'
// GLOBAL VARIABLE FOR THE API
let username = '';
let apiKeyWeatherBit = '';
let apiKeyPixBay = ''
//  GLOBAL VARIABLE
let weatherBitMatchDay = ''
let responseGeo = ''
let tripImg = ''
//Set date input field's min date to today
date.min = new Date().toLocaleDateString('en-ca')
// RESQUEST TO THE SERVER TO PULL API KEYS
const apiKeys = async () => {
  try {
    const response = await fetch('http://localhost:3000/key')
    const data = await response.json()
    username = await data.geoUserName
    apiKeyWeatherBit = await data.apiKeyWeatherBit
    apiKeyPixBay = await data.apiKeyPixaBay
  }
  catch (err) {
    console.log(err)
  }
}
apiKeys()

// -------
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
      alert('Make sure to enter the correct city!')
    }
  }
  catch (err) {
    alert('Make sure to enter the correct city!')
    return false
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
      weatherBitMatchDay = await weatherBitData.filter(day => day.datetime === date.value)
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
    console.log(data)
  }
  catch (err) {
    console.log(err)
    return false
  }
}
// UDDATE UI
const updateUi = async () => {
  try {
    if (weatherBitMatchDay && responseGeo) {
      //
      entryCountry.innerHTML = responseGeo.geoCountry
      entryCity.innerHTML = responseGeo.geoName
      entryDeparting.innerHTML = weatherBitMatchDay[0].datetime
      entryHighTemp.innerHTML = Math.floor(weatherBitMatchDay[0].high_temp)
      entryLowTemp.innerHTML = Math.floor(weatherBitMatchDay[0].low_temp)
      tempDesc.innerHTML = weatherBitMatchDay[0].weather.description
      // tempIcon.innerHTML = weatherBitMatchDay[0].weather.icon
      //
      if (!tripImg) {
        entryImg.setAttribute('src', UrlImageNoAvailable)
      }
      else {
        entryImg.setAttribute('src', tripImg.webformatURL)
      }
      //RESET INPUT
      city.value = ''
      date.value = ''
    }
  }
  catch (err) {
    return false
  }
}

btnGenerate.addEventListener('click', () => {
  if (!date.value || !city.value) {
    alert('Please make sure all fields are filled in correctly! ')
    return
  }
  geoName()
    .then((data) => weatherBit(data))
    .then(() => pixaBay())
    .then(() => updateUi())

})

export { geoName }