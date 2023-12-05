const form = document.querySelector("form"); // Form element
const submitBtn = document.querySelector(".submit-btn"); // Submit button
const error = document.querySelector(".error-msg"); // Error message element

// Event listeners
form.addEventListener("submit", handleSubmit); // Submit event listener
submitBtn.addEventListener("click", handleSubmit); // Click event listener
window.addEventListener("load", handleSubmit); // Load event listener

// Function to handle form submission
function handleSubmit(e) {
	if (e.type == "load") {
		document.querySelector('input[type="text"]').value = "melbourne"; // Set default value on page load
	}

	e.preventDefault(); // Prevent form submission
	fetchWeather(); // Fetch weather data

	if (e.type == "load") {
		document.querySelector('input[type="text"]').value = ""; // Clear input value on page load
	}
}

// Function to fetch weather data
async function getWeatherData(location) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=1986480656ec490d950204923202611&q=${location}`,
		{
			mode: "cors",
		}
	);
	if (response.status === 400) {
		throwErrorMsg(); // Throw error message if response status is 400
	} else {
		error.style.display = "none"; // Hide error message
		const weatherData = await response.json();
		const newData = processData(weatherData); // Process weather data
		displayData(newData); // Display weather data
		reset(); // Reset form
	}
}

// Function to throw error message
function throwErrorMsg() {
	error.style.display = "block"; // Show error message
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

// Function to process weather data
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

// Function to display weather data
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

// Function to reset form
function reset() {
	form.reset();
}

// Function to fetch location suggestions
async function fetchLocationSuggestions(query) {
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

// Function to populate datalist with location suggestions
function populateDatalist(locations) {
	const datalist = document.getElementById("locations");
	datalist.innerHTML = ""; // Clear previous suggestions
	locations.forEach((location) => {
		const option = document.createElement("option");
		option.value = location;
		datalist.appendChild(option);
	});
}

// Event listener for input change
const input = document.querySelector('input[type="text"]');
input.addEventListener("input", handleInput);

// Variable to store last input value
let lastInputValue = input.value;

// Function to handle input change
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

// API key for Radar.io
const apiKey = "prj_live_pk_874cabd607b9483b7bf4b1716c1e301fbd906622";
