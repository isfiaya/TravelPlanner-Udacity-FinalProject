// SELECTORS
const entryCountry = document.getElementById('entry__country')
const entryCity = document.getElementById('entry__city')
const entryImg = document.getElementById('entry__img')
const entryDeparting = document.getElementById('entry__departing')
const entryHighTemp = document.getElementById('entry__high__temp')
const entryLowTemp = document.getElementById('entry__low__temp')
const tempDesc = document.getElementById('temp__desc')
// const tempIcon = document.getElementById('temp__icon')
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
      entryCountry.innerHTML = dataStorage.Country
      entryCity.innerHTML = dataStorage.City
      entryDeparting.innerHTML = dataStorage.weatherBitMatchDay[0].datetime
      entryHighTemp.innerHTML = Math.floor(dataStorage.weatherBitMatchDay[0].high_temp)
      entryLowTemp.innerHTML = Math.floor(dataStorage.weatherBitMatchDay[0].low_temp)
      tempDesc.innerHTML = dataStorage.weatherBitMatchDay[0].weather.description
      lengthTrip.innerHTML = dataStorage.dateDeff
      dataStorage.dateDeff > 1 ? daysTravel.innerHTML = 'Days' : daysTravel.innerHTML = 'Day'
      dataStorage.tripImg ? entryImg.setAttribute('src', dataStorage.tripImg.webformatURL) : entryImg.setAttribute('src', UrlImageNoAvailable)
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