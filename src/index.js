import './css/styles.css';

import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const toMuchMessage =
  'Too many matches found. Please enter a more specific name.';
const notFoundMessage = '"Oops, there is no country with that name"';
