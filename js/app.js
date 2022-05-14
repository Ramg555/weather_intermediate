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
const search_button = document.querySelector("#search_button");
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
const search_box = document.querySelector("#search_box");
const centigrades = document.querySelector("#centigrades").addEventListener("focus", console.log("Centigrados activados"))
const fahrenheit = document.querySelector("#fahrenheit").addEventListener("focus", console.log("Fahrenheit activados"))
// Event Listeners
document.addEventListener("DOMContentLoaded", ObtenerLocacion());
search_button.addEventListener("click", () => BuscarPais() )
const search = document.querySelector("#search").addEventListener("click" , () => {
    search_box.classList.remove("desactive")
    search_box.classList.add("active");
})
const close_search = document.querySelector("#close_search").addEventListener("click", () => {
    search_box.classList.remove("active")
    search_box.classList.add("desactive");
})






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

function BuscarPais(){
    const busqueda = search_input.value;
    if(busqueda === ""){
        console.log("El campo esta vacio");
        return;
    }else{
        fetch(`https://community-open-weather-map.p.rapidapi.com/find?q=${busqueda}&cnt=2&type=like&units=metric`, options)
        .then(response => response.json())
        .then(response => {
            console.log("Buscar Pais");
            console.log(response)
            limpiarListaHTML();
            ImprimirLista(response)
        })
        .catch(err => console.error(err));
    }
}

function ImprimirLista(objeto){
    const lista = objeto.list;
    lista.forEach(objeto => {
        let nombre = objeto.name
        const {lat,lon} = objeto.coord;
        const paisHTML = document.createElement("li");
        paisHTML.textContent = nombre;
        paisHTML.classList.add("result");
        paisHTML.dataset.lat = lat;
        paisHTML.dataset.lon = lon;
        paisHTML.onclick = () => ObtenerNombre(lat,lon)
        list_result.appendChild(paisHTML);
    })

}



function ImprimirHTML5Dias(lista){
    while(cards.firstChild){
        cards.removeChild(cards.firstChild)
    }
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
    // const image_icon = document.createElement("img")
    // image_icon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
    // current_image_weather.appendChild(image_icon);

    current_image_weather.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="">
    `

    // Temperatura
    temperature.innerHTML = `
        <p><b>${temperatura}</b>°C</p>
    `
    // Nombre del clima (Rain,Thunderstorm,Clear etc...)
    name_weather.innerHTML = `
        <p>${description}</p>
    `
    // Fecha de hoy
    // const fechaHTML = document.createElement("p")
    // fechaHTML.textContent = moment().format("MMMM Do YYYY");
    // date.appendChild(fechaHTML);

    date.innerHTML = `
        <p>Today</p>
        <p> ${moment().format("MMMM Do YYYY")} </p>
    `

    // Nombre de la ciudad
    // const nombreCiudad = document.createElement("p");
    // nombreCiudad.textContent = name;
    // city_name.appendChild(nombreCiudad);

    city_name.innerHTML = `
    <div class="icon-location">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
    </div>
        <p> ${name} </p>
    `

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

function limpiarListaHTML(){
    while(list_result.firstChild){
        list_result.removeChild(list_result.firstChild);
    }
}


