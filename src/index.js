import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const toMuchMessage =
  'Too many matches found. Please enter a more specific name.';
const notFoundMessage = 'Oops, there is no country with that name';

const listStylesProperties = {
  ulMargin: '0',
  ulPadding: '10px',
  ulFontSize: '30px',
  ulDisplay: 'flex',
  ulFlexDirection: 'column',
  ulGap: '10px',
  liDisplay: 'flex',
  liAlignItems: 'center',
  liMargin: '0px 0px 10px 0px',
  svgHeight: '30',
  svgMarginRight: '20px',
  pMargin: '0',
};

const cardStylesProperties = {
  cardDisplay: 'flex',
  cardFlexDirection: 'column',
  cardGap: '10px',
  cardFontSize: '20px',
  headlineFontSize: '30px',
  headlineMargin: '0',
  svgHeight: '30',
  svgMarginRight: '20px',
};

const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

let name = '';

searchBoxEl.addEventListener(
  'input',
  debounce(onSearchBoxElInput, DEBOUNCE_DELAY)
);

function onSearchBoxElInput(event) {
  clearForms();

  name = event.target.value.trim();

  if (name === '') {
    clearForms();
  } else {
    fetchCountries(name)
      .then(countries => {
        if (countries.length === 1) {
          renderCountryInfo(countries, cardStylesProperties.svgHeight);
          styleCountryCard(countryInfoEl, cardStylesProperties);
        } else if (countries.length > 1 && countries.length <= 10) {
          renderCountryList(countries, listStylesProperties.svgHeight);
          styleCountryList(countryListEl, listStylesProperties);
        } else {
          Notify.info(toMuchMessage);
        }
      })
      .catch(error => {
        console.log(error);
        Notify.failure(notFoundMessage);
      });
  }
}

function renderCountryList(countries, svgHeight) {
  const markup = countries
    .map(country => {
      return `<li>
      ${renderSvgImage(country, svgHeight)}
      <p>${country.name.official}</p>
      </li>`;
    })
    .join('');
  countryListEl.innerHTML = markup;
}

function renderCountryInfo(countries, svgHeight) {
  const country = countries[0];
  const languagesString = buildLanguagesString(country);

  countryInfoEl.innerHTML = `
  <h3>${renderSvgImage(country, svgHeight)}${country.name.official}</h3>
  <p><b>Capital:</b> ${country.capital}</p>
  <p><b>Population:</b> ${country.population}</p>
  <p><b>Languages:</b> ${languagesString}</p>`;
}

function renderSvgImage(countryObj, svgHeight) {
  return `<svg 
  height="${svgHeight}">       
     <image xlink:href="${countryObj.flags.svg}" 
     src="${countryObj.flags.png}" 
     height="${svgHeight}" 
     alt="${countryObj.flags.alt}"/>    
</svg>`;
}

function buildLanguagesString(countryObj) {
  let languages = [];
  for (let language in countryObj.languages) {
    languages.push(countryObj.languages[language]);
  }
  return languages.map(language => language).join(', ');
}

function clearForms() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function styleCountryList(countryListElement, listProperties) {
  countryListElement.style.margin = listProperties.ulMargin;
  countryListElement.style.padding = listProperties.ulPadding;
  countryListElement.style.fontSize = listProperties.ulFontSize;
  countryListElement.style.display = listProperties.ulDisplay;
  countryListElement.style.flexDirection = listProperties.ulFlexDirection;
  countryListElement.style.gap = listProperties.ulGap;

  const liElements = countryListElement.querySelectorAll('li');

  liElements.forEach(li => {
    li.style.display = listProperties.liDisplay;
    li.style.alignItems = listProperties.liAlignItems;

    const svgEl = li.querySelector('svg');
    const pEl = li.querySelector('p');

    svgEl.style.marginRight = listProperties.svgMarginRight;
    svgEl.style.height = listProperties.svgHeight;
    svgEl.style.maxWidth = `${(parseInt(listProperties.svgHeight) / 2) * 4}`;

    pEl.style.margin = listProperties.pMargin;
  });
}

function styleCountryCard(countryCardElement, cardStylesProperties) {
  const headlineEl = countryCardElement.querySelector('h3');
  const svgEl = countryCardElement.querySelector('svg');

  countryCardElement.style.display = cardStylesProperties.cardDisplay;
  countryCardElement.style.flexDirection =
    cardStylesProperties.cardFlexDirection;
  countryCardElement.style.gap = cardStylesProperties.cardGap;
  countryCardElement.style.fontSize = cardStylesProperties.cardFontSize;

  headlineEl.style.fontSize = cardStylesProperties.headlineFontSize;
  headlineEl.style.margin = cardStylesProperties.headlineMargin;

  svgEl.style.marginRight = cardStylesProperties.svgMarginRight;
  svgEl.style.maxWidth = `${
    (parseInt(cardStylesProperties.svgHeight) / 2) * 4
  }`;
}
