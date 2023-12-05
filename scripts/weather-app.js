// Selecting form, submit button and error message elements from the DOM
const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit-btn");
const error = document.querySelector(".error-msg");

// Adding event listeners for form submission, button click and window load
form.addEventListener("submit", handleSubmit);
submitBtn.addEventListener("click", handleSubmit);
window.addEventListener("load", handleSubmit);

// Function to handle form submission and window load events
function handleSubmit(e) {
	// When the page first loads set the initial location to Melbourne
	if (e.type == "load") {
		document.querySelector('input[type="text"]').value = "melbourne";
	}

	e.preventDefault();
	fetchWeather();

	// When the page first loads clear the input value
	if (e.type == "load") {
		document.querySelector('input[type="text"]').value = "";
	}
}

// Function to fetch weather data for a given location
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

// Function to display an error message
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

// Function to process the fetched weather data
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

// Function to display the processed weather data on the webpage
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

// Function to reset the form
function reset() {
	form.reset();
}

// Function to fetch weather data for the location entered by the user
function fetchWeather() {
	const input = document.querySelector('input[type="text"]');
	const userLocation = input.value;
	getWeatherData(userLocation);
}

// Adding an event listener for input changes
const input = document.querySelector('input[type="text"]');
input.addEventListener("input", handleInput);

let lastInputValue = input.value;

// Function to handle input changes
async function handleInput(e) {
	const userInput = e.target.value;
	if (userInput.length > 2) {
		// Only fetch suggestions if user has typed 3 or more characters
		const locations = await fetchLocationSuggestions(userInput);
		if (userInput != locations[0]) {
			populateDatalist(locations);
		}
	}
}

const apiKey = "prj_live_pk_874cabd607b9483b7bf4b1716c1e301fbd906622";

// Function to fetch location suggestions based on the user's input
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
	const addresses = data.addresses.map(
		(address) => `${address.city},${address.country}`
	);
	const uniqueAddresses = [...new Set(addresses)];
	return uniqueAddresses;
}

// Function to populate the datalist with location suggestions
function populateDatalist(locations) {
	const datalist = document.getElementById("locations");
	datalist.innerHTML = ""; // Clear previous suggestions
	locations.forEach((location) => {
		const option = document.createElement("option");
		option.value = location;
		datalist.appendChild(option);
	});
	console.log(document.getElementById("locations"));
}
