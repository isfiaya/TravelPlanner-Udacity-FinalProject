// SELECTORS
const resultCountry = document.getElementById('result__country')
const resultCity = document.getElementById('result__city')
const resultImg = document.getElementById('result__img')
const resultDeparting = document.getElementById('result__departing')
const resultHighTemp = document.getElementById('result__high__temp')
const resultLowTemp = document.getElementById('result__low__temp')
const tempDesc = document.getElementById('temp__desc')
const lengthTrip = document.getElementById('length__trip')
const daysTravel = document.getElementById('days__travel')
//  GLOBAL VARIABLE
let dataStorage = ''
// URL IMAGE IF pixaBay NOT FOUND IMAGE
const UrlImageNoAvailable = 'https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/no-image.png'
// UDDATE UI
const updateUi = async () => {
  const localStorageContent = localStorage.getItem('data');
  dataStorage = JSON.parse(localStorageContent);
  try {
    if (dataStorage) {
      resultCountry.innerHTML = dataStorage.Country
      resultCity.innerHTML = dataStorage.City
      resultDeparting.innerHTML = dataStorage.weatherBitMatchDay[0].datetime
      resultHighTemp.innerHTML = Math.floor(dataStorage.weatherBitMatchDay[0].high_temp)
      resultLowTemp.innerHTML = Math.floor(dataStorage.weatherBitMatchDay[0].low_temp)
      tempDesc.innerHTML = dataStorage.weatherBitMatchDay[0].weather.description
      lengthTrip.innerHTML = dataStorage.dateDeff
      dataStorage.dateDeff > 1 ? daysTravel.innerHTML = 'Days' : daysTravel.innerHTML = 'Day'
      dataStorage.tripImg ? resultImg.setAttribute('src', dataStorage.tripImg.webformatURL) : resultImg.setAttribute('src', UrlImageNoAvailable)
    }
  }
  catch (err) {
    return false
  }
}
// IF LOCALSTORAGE EXIST UPDATE UI
window.addEventListener('load', (e) => {
  const localStorageContent = localStorage.getItem('data');
  dataStorage = JSON.parse(localStorageContent);
  if (dataStorage) {
    updateUi()
  }
});
export { updateUi }