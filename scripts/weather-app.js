const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit-btn");
const error = document.querySelector(".error-msg");
form.addEventListener("submit", handleSubmit);
submitBtn.addEventListener("click", handleSubmit);
window.addEventListener("load", handleSubmit);

function handleSubmit(e) {
	if (e.type == "load") {
		document.querySelector('input[type="text"]').value = "melbourne";
	}

	e.preventDefault();
	fetchWeather();

	if (e.type == "load") {
		document.querySelector('input[type="text"]').value = "";
	}
}

async function getWeatherData(location) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=1986480656ec490d950204923202611&q=${location}`,
		{
			mode: "cors",
		}
	);
	if (response.status === 400) {
		throwErrorMsg();
	} else {
		error.style.display = "none";
		const weatherData = await response.json();
		const newData = processData(weatherData);
		displayData(newData);
		reset();
	}
}

function throwErrorMsg() {
	error.style.display = "block";
	if (error.classList.contains("fade-in")) {
		error.style.display = "none";
		error.classList.remove("fade-in2");
		error.offsetWidth;
		error.classList.add("fade-in");
		error.style.display = "block";
	} else {
		error.classList.add("fade-in");
	}
}

function processData(weatherData) {
	const myData = {
		condition: weatherData.current.condition.text,
		feelsLike: {
			f: Math.round(weatherData.current.feelslike_f),
			c: Math.round(weatherData.current.feelslike_c),
		},
		currentTemp: {
			f: Math.round(weatherData.current.temp_f),
			c: Math.round(weatherData.current.temp_c),
		},
		wind: Math.round(weatherData.current.wind_kph),
		humidity: weatherData.current.humidity,
		location: weatherData.location.name.toUpperCase(),
	};

	if (weatherData.location.country === "United States of America") {
		myData["region"] = weatherData.location.region.toUpperCase();
	} else {
		myData["region"] = weatherData.location.country.toUpperCase();
	}

	return myData;
}

function displayData(newData) {
	const weatherInfo = document.getElementsByClassName("info");
	Array.from(weatherInfo).forEach((div) => {
		if (div.classList.contains("fade-in2")) {
			div.classList.remove("fade-in2");
			div.offsetWidth;
			div.classList.add("fade-in2");
		} else {
			div.classList.add("fade-in2");
		}
	});
	document.querySelector(".condition").textContent = newData.condition;
	document.querySelector(
		".location"
	).textContent = `${newData.location}, ${newData.region}`;
	document.querySelector(".degrees").textContent = newData.currentTemp.c;
	document.querySelector(
		".feels-like"
	).textContent = `FEELS LIKE: ${newData.feelsLike.c}`;
	document.querySelector(
		".wind-mph"
	).textContent = `WIND: ${newData.wind} KPH`;
	document.querySelector(
		".humidity"
	).textContent = `HUMIDITY: ${newData.humidity}`;
}

function reset() {
	form.reset();
}

function fetchWeather() {
	const input = document.querySelector('input[type="text"]');
	const userLocation = input.value;
	getWeatherData(userLocation);
}

const input = document.querySelector('input[type="text"]');
input.addEventListener("input", handleInput);

let lastInputValue = input.value;

async function handleInput(e) {
	const userInput = e.target.value;
	if (userInput.length > 2) {
		// Only fetch suggestions if user has typed 3 or more characters
		const locations = await fetchLocationSuggestions(userInput);
		console.log(locations);
		if (userInput != locations[0]) {
			populateDatalist(locations);
		}
	}
}

const apiKey = "prj_live_pk_874cabd607b9483b7bf4b1716c1e301fbd906622";

async function fetchLocationSuggestions(query) {
	// limited to 10 requests per second
	const response = await fetch(
		`https://api.radar.io/v1/search/autocomplete?query=${query}`,
		{
			headers: {
				Authorization: apiKey,
			},
		}
	);
	const data = await response.json();
	return data.addresses.map((address) => address.formattedAddress);
}

function populateDatalist(locations) {
	const datalist = document.getElementById("locations");
	datalist.innerHTML = ""; // Clear previous suggestions
	locations.forEach((location) => {
		const option = document.createElement("option");
		option.value = location;
		datalist.appendChild(option);
	});
}
