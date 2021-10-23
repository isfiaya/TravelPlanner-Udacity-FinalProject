// SELECTORS
const btnGenerate = document.getElementById('generate')
const startDate = document.getElementById('start__date')
const endDate = document.getElementById('end__date')
const city = document.getElementById('city')
const entryCountry = document.getElementById('entry__country')
const entryCity = document.getElementById('entry__city')
const entryImg = document.getElementById('entry__img')
const entryDeparting = document.getElementById('entry__departing')
const entryHighTemp = document.getElementById('entry__high__temp')
const entryLowTemp = document.getElementById('entry__low__temp')
const tempDesc = document.getElementById('temp__desc')
const tempIcon = document.getElementById('temp__icon')
const lengthTrip = document.getElementById('length__trip')
const daysTravel = document.getElementById('days__travel')
// URL IMAGE IF pixaBay NOT FOUND IMAGE
const UrlImageNoAvailable = 'https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/no-image.png'
// GLOBAL VARIABLE FOR THE API KEYS
let username = '';
let apiKeyWeatherBit = '';
let apiKeyPixBay = ''
//  GLOBAL VARIABLE
let weatherBitMatchDay = ''
let responseGeo = ''
let tripImg = ''
let dateDeff = ''
// Set date input field's min date today 
// SET MAX DATE 5 DAYS FROM TODAY 
const maxDate = new Date(new Date().getTime() + (15 * 24 * 60 * 60 * 1000));
startDate.min = new Date().toLocaleDateString('en-ca')
startDate.max = maxDate.toLocaleDateString('en-ca')
endDate.min = new Date().toLocaleDateString('en-ca')
endDate.max = startDate.max = maxDate.toLocaleDateString('en-ca')
// 
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
// a and b are javascript Date objects
function dateDiffInDays() {
  // Discard the time and time-zone information.
  const a = new Date(startDate.value)
  const b = new Date(endDate.value)
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  dateDeff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
// RESQUEST TO THE SERVER TO GET API KEYS
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
// UDDATE UI
let dataStorage = ''
const updateUi = async () => {
  const localStorageContent = localStorage.getItem('data');
  dataStorage = JSON.parse(localStorageContent);
  try {
    if (dataStorage) {
      //
      entryCountry.innerHTML = dataStorage.Country
      entryCity.innerHTML = dataStorage.City
      entryDeparting.innerHTML = dataStorage.weatherBitMatchDay[0].datetime
      entryHighTemp.innerHTML = Math.floor(dataStorage.weatherBitMatchDay[0].high_temp)
      entryLowTemp.innerHTML = Math.floor(dataStorage.weatherBitMatchDay[0].low_temp)
      tempDesc.innerHTML = dataStorage.weatherBitMatchDay[0].weather.description
      lengthTrip.innerHTML = dataStorage.dateDeff
      // tempIcon.innerHTML = weatherBitMatchDay[0].weather.icon
      dataStorage.dateDeff > 1 ? daysTravel.innerHTML = 'Days' : daysTravel.innerHTML = 'Day'
      // SET IMAGE BASED IF THERE IMAGE AVAILABLE  OR NOT 
      dataStorage.tripImg ? entryImg.setAttribute('src', dataStorage.tripImg.webformatURL) : entryImg.setAttribute('src', UrlImageNoAvailable)
      //RESET INPUT
      city.value = ''
      startDate.value = ''
      endDate.value = ''
    }
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
  dateDiffInDays()
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
        dateDeff: dateDeff
      }
      localStorage.setItem('data', JSON.stringify(data));
    })
    .then(() => updateUi())
})
// WINDOW LOAD
window.addEventListener('load', (e) => {
  const localStorageContent = localStorage.getItem('data');
  dataStorage = JSON.parse(localStorageContent);
  console.log(dataStorage)
  if (dataStorage) {
    updateUi()
  }
});


export { geoName }