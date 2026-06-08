/* =========================
   VARIABLES
========================= */

const countryCardsContainer = document.getElementById(
  "country-cards-container",
);

const countrySearch = document.getElementById("countrySearch");

const regionFilter = document.getElementById("regionFilter");

const populationFilter = document.getElementById("populationFilter");

const showMoreBtn = document.getElementById("showMoreBtn");

let displayCount = 12;

let filteredCountries = [];

/* =========================
   FETCH DATA
========================= */

function fetchData() {
  return fetch("http://localhost:3000/countries")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .catch(function (error) {
      console.error("Error fetching countries data");
      throw error;
    });
}

/* =========================
   GET FORMATTED CURRENCIES
========================= */

function getFormattedCurrencies(currencies) {
  const currencyCodes = Object.keys(currencies);
  const currencyNames = [];

  currencyCodes.forEach(function (code) {
    currencyNames.push(currencies[code].name);
  });

  return currencyNames.join(", ");
}

/* =========================
   GET FORMATTED LANGUAGES
========================= */

function getFormattedLanguages(languages) {
  const languageCodes = Object.keys(languages);
  const languageNames = [];

  languageCodes.forEach(function (code) {
    languageNames.push(languages[code]);
  });

  return languageNames.join(", ");
}

/* =========================
   COUNTRY CARD HANDLER
========================= */

function countryCardHandler(country) {
  const queryString =
    "?name=" +
    encodeURIComponent(country.name.official) +
    "&flag=" +
    encodeURIComponent(country.flags.svg) +
    "&population=" +
    country.population +
    "&region=" +
    country.region +
    "&subRegion=" +
    encodeURIComponent(country.subregion) +
    "&capital=" +
    encodeURIComponent(country.capital) +
    "&currencies=" +
    encodeURIComponent(getFormattedCurrencies(country.currencies)) +
    "&languages=" +
    encodeURIComponent(getFormattedLanguages(country.languages));

  window.location.href = "detail.html" + queryString;
}

/* =========================
   POPULATE COUNTRY CARDS
========================= */

function populateCountryCards(countries) {
  /* CLEAR CONTAINER */

  countryCardsContainer.innerHTML = "";

  /* EMPTY CHECK */

  if (countries.length === 0) {
    countryCardsContainer.innerHTML = `
      <p class="error-message">
        No country found matching the search criteria.
      </p>
    `;

    showMoreBtn.style.display = "none";

    return;
  }

  /* LOOP LIMIT */

  const loopCounter = Math.min(displayCount, countries.length);

  /* SHOW MORE BUTTON */

  if (displayCount >= countries.length) {
    showMoreBtn.style.display = "none";
  } else {
    showMoreBtn.style.display = "block";
  }

  /* LOOP */

  for (let i = 0; i < loopCounter; i++) {
    const country = countries[i];

    /* CARD */

    const card = document.createElement("div");

    card.classList.add("country-card");

    /* REGISTER EVENT HANDLER */

    card.addEventListener("click", () => countryCardHandler(country));

    /* FLAG */

    const flagContainer = document.createElement("div");

    flagContainer.classList.add("flag-container");

    const flagImage = document.createElement("img");

    flagImage.src = country.flags.png;
    flagImage.alt = country.name.common;

    flagContainer.appendChild(flagImage);

    /* INFO */

    const countryInfo = document.createElement("div");

    countryInfo.classList.add("country-info");

    const countryName = document.createElement("h2");

    countryName.textContent = country.name.common;

    const population = document.createElement("p");

    population.innerHTML = `
      <strong>Population:</strong>
      ${country.population.toLocaleString()}
    `;

    const capital = document.createElement("p");

    capital.innerHTML = `
      <strong>Capital:</strong>
      ${country.capital || "N/A"}
    `;

    const region = document.createElement("p");

    region.innerHTML = `
      <strong>Region:</strong>
      ${country.region}
    `;

    countryInfo.appendChild(countryName);

    countryInfo.appendChild(population);

    countryInfo.appendChild(capital);

    countryInfo.appendChild(region);

    /* APPEND CARD */

    card.appendChild(flagContainer);

    card.appendChild(countryInfo);

    countryCardsContainer.appendChild(card);
  }
}

/* =========================
   POPULATE REGIONS
========================= */

function populateRegions(data) {
  const regions = [...new Set(data.map((country) => country.region))];

  regions.sort();

  regions.forEach((region) => {
    const option = document.createElement("option");

    option.value = region;

    option.textContent = region;

    regionFilter.appendChild(option);
  });
}

/* =========================
   ERROR MESSAGE
========================= */

function showErrorMessage(inputElement, message) {
  removeErrorMessages();

  const error = document.createElement("p");

  error.classList.add("error-message");

  error.textContent = message;

  inputElement.parentElement.appendChild(error);
}

function removeErrorMessages() {
  document
    .querySelectorAll(".error-message")
    .forEach((element) => element.remove());
}

/* =========================
   FILTER DATA
========================= */

function filterData(data) {
  removeErrorMessages();

  const searchValue = countrySearch.value.trim();

  const selectedRegion = regionFilter.value;

  const populationValue = populationFilter.value.trim();

  /* VALIDATE COUNTRY NAME */

  const regex = /^[a-zA-Z -]*$/;

  if (searchValue && !regex.test(searchValue)) {
    showErrorMessage(countrySearch, "Enter valid Country Name.");

    return;
  }

  /* VALIDATE POPULATION */

  if (populationValue && Number(populationValue) > 1500000000) {
    showErrorMessage(
      populationFilter,
      "Country's population cannot be greater than 1.5 billion.",
    );

    return;
  }

  /* FILTER */

  filteredCountries = data.filter((country) => {
    const searchTerm = searchValue.toLowerCase();

    const commonName = country.name.common.toLowerCase();

    const officialName = country.name.official.toLowerCase();

    const matchesName =
      commonName.includes(searchTerm) || officialName.includes(searchTerm);

    const matchesRegion =
      selectedRegion === "" ? true : country.region === selectedRegion;

    const matchesPopulation =
      populationValue === ""
        ? true
        : country.population >= Number(populationValue);

    return matchesName && matchesRegion && matchesPopulation;
  });

  displayCount = 12;

  populateCountryCards(filteredCountries);
}

/* =========================
   SHOW MORE
========================= */

function showMoreHandler() {
  displayCount += 10;

  populateCountryCards(filteredCountries);
}

/* =========================
   EVENT LISTENERS
========================= */

showMoreBtn.addEventListener("click", showMoreHandler);

/* =========================
   DOM CONTENT LOADED
========================= */

document.addEventListener("DOMContentLoaded", () => {
  fetchData().then(function (data) {
    populateRegions(data);

    filteredCountries = [...data];

    populateCountryCards(filteredCountries);

    countrySearch.addEventListener("input", () => filterData(data));

    regionFilter.addEventListener("change", () => filterData(data));

    populationFilter.addEventListener("input", () => filterData(data));
  });
});
