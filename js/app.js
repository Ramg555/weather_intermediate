// Lista de datos a sacar
// -Imagen Principal
// -Temperatura Actual
// -Nombre del clima actual
// -Fecha actual
// -Lugar
// -Fechas de los 5 siguientes 
// -Temperatua maxima y minima de dichas 5
// -El status del viento
// -Porcentaje de humedad
// -La visibilidad
// -Presion del aire
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com',
		'X-RapidAPI-Key': '718201c91fmshc7b34108a509da6p128f18jsn3a998e8badd7'
	}
};


// Variables
const search_input = document.querySelector("#search_input");
const current_image_weather = document.querySelector("#current_image_weather");
const temperature = document.querySelector("#temperature");
const name_weather = document.querySelector("#name");
const date = document.querySelector("#date");
const city_name = document.querySelector("#city_name");
const wind_status = document.querySelector("#wind_status");
const _humedad = document.querySelector("#humidity");
const visibilidad = document.querySelector("#visibility");
const pressure = document.querySelector("#pressure");
const cards = document.querySelector("#cards");
const list_result = document.querySelector("#list_result");

// Event Listeners
document.addEventListener("DOMContentLoaded", ObtenerLocacion());
search_input.addEventListener("input", () => console.log(search_input.value))






// Funciones
function ObtenerLocacion(){
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude
            ObtenerNombre(latitude,longitude);
        })
    }
}


function ObtenerNombre(latitud,longitud){
    fetch(`https://community-open-weather-map.p.rapidapi.com/forecast/daily?lat=${latitud}&lon=${longitud}&cnt=5&units=metric`, options)
    .then(response => response.json())
    .then(response => {
        console.log("5 Dias:");
        console.log(response);
        ImprimirHTML5Dias(response.list)
        ObtenerClimaActual(response.city.name)
    })
    .catch(err => console.error(err));
}

function ObtenerClimaActual(ciudad){
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${ciudad}&units=metric`, options)
    .then(response => response.json())
    .then(response => {
        console.log("Current Weather");
        console.log(response)
        ImprimirHTMLCurrent(response)
    })
    .catch(err => console.error(err));
}

function BuscarPais(name){
    fetch(`https://community-open-weather-map.p.rapidapi.com/find?q=${name}&cnt=2&type=like&units=metric`, options)
	.then(response => response.json())
	.then(response => {
        console.log("Buscar Pais");
        console.log(response)
        ImprimirLista(response)
    })
	.catch(err => console.error(err));
}

function ImprimirLista(objeto){
    const lista = objeto.list;
    lista.forEach(objeto => {
        let nombre = objeto.name
        const {lat,lon} = objeto.coord;
        const paisHTML = document.createElement("li");
        paisHTML.textContent = nombre;
        paisHTML.classList.add("result");
        list_result.appendChild(paisHTML);
    })

}



function ImprimirHTML5Dias(lista){
    let contador = 0;
    lista.forEach( dia => {
        contador++;
        const {temp,weather} = dia
        const cardHTML = document.createElement("div")
        cardHTML.classList.add("col" , "next-weather")
        cardHTML.innerHTML = `
        <div class="card">
            <p class="date">${moment().add(contador,"days").format("ddd, D, MMM")}</p>
            <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" width="50px" alt="" class="weather-card">
            <div class="max-min-container">
                <p class="max">${parseInt(temp.max)}C°</p>
                <p class="min">${parseInt(temp.min)}C°</p>
            </div>
        </div>
        `
        cards.appendChild(cardHTML);
    })
}

function ImprimirHTMLCurrent(objeto){
    const {main,name,visibility,weather,wind} = objeto
    const humedad = main.humidity;
    const temperatura = parseInt(main.temp);
    const pressAire = main.pressure;
    const description = weather[0].description;
    const icon = weather[0].icon;
    const wind_speed = wind.speed;
    const wind_degrees = wind.deg;

    // Imagen grande en el side
    const image_icon = document.createElement("img")
    image_icon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
    current_image_weather.appendChild(image_icon);
    // Temperatura
    temperature.innerHTML = `
        <p><b>${temperatura}</b>°C</p>
    `
    // Nombre del clima (Rain,Thunderstorm,Clear etc...)
    name_weather.innerHTML = `
        <p>${description}</p>
    `
    // Fecha de hoy
    const fechaHTML = document.createElement("p")
    fechaHTML.textContent = moment().format("MMMM Do YYYY");
    date.appendChild(fechaHTML);
    // Nombre de la ciudad
    const nombreCiudad = document.createElement("p");
    nombreCiudad.textContent = name;
    city_name.appendChild(nombreCiudad);
    // Estado del viento (Wind Status)
    wind_status.innerHTML = `
    <p>Wind status</p>
    <p class="mph"><b>${wind_speed}</b>mph</p>
    <div>
        <i class="fa-solid fa-location-arrow"></i>
        <p class="wind-direction">${wind_degrees}°</p>
    </div>
    `
    // Humedad
    _humedad.innerHTML = `
    <p>Humidity</p>
    <p class="humidity-percent"><b>${humedad}</b>%</p>
    <div class="the-progress-bar">
        <div class="progress-bar-values">
            <p>0</p>
            <p>50</p>
            <p>100</p>
        </div>
        <progress value="${humedad}" max="100" class="bar"></progress>
        <div>
            <p style="float: right; ">%</p>
        </div>
    </div>
    `
    // Visibilidad
    visibilidad.innerHTML= `
        <p>Visibility</p>
        <p class="number"><b>${visibility/1000}</b> Km</p>
    `
    // Presion del aire
    pressure.innerHTML = `
        <p>Air Pressure</p>
        <p class="number"><b>${pressAire}</b> mb</p>
    `
}


