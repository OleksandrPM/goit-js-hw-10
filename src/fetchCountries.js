const baseUrl = 'https://restcountries.com/v3.1';

const properties = 'name,capital,population,flags,languages';

export { fetchCountries };

function fetchCountries(name) {
  const fetchUrl = `${baseUrl}/name/${name}?fields=${properties}`;

  return fetch(fetchUrl).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
