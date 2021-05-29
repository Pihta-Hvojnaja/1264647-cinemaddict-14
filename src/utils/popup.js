
const ONE_GENRE = 1;
const ONE_NAME = 1;


/**
 * Функция, если жанров несколько, выводит слово «Genres», иначе «Genre»
 * @param {Array} genres - принимает массив с жанрами
 * @returns {string} - возвращает строку со словом "Genre" или "Genres"
 */
const defineNumberGenre = (genres) => genres.length === ONE_GENRE ? 'Genre' : 'Genres';


/**
 * Функция генерирует разметку с названиями жанров или жанра
 * @param {Array} genres - принимает массив с жанрами
 * @returns {string} - возвращает разметку с жанрами
 */
const getGenre = (genres) => {
  if (genres.length === ONE_GENRE) {
    return `<span class="film-details__genre">${genres}</span>`;
  }

  const glueTags = (accumulator, currentValue) => {
    accumulator += `<span class="film-details__genre">${currentValue}</span>`;
    return accumulator;
  };

  return genres.reduce(glueTags, '');
};


/**
 * Функция переводим массив с именами в строку
 * @param {Array} names - массив имен
 * @returns {string} - возвращает имена в форме строки
 */
const getName = (names) => {
  return names.length > ONE_NAME ? names.join(', ') : names + '';
};


export {
  defineNumberGenre,
  getGenre,
  getName
};
