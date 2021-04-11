
/*  Функция поля жанры/жанр
   ========================================================================== */

const defineNumberGenre = (genres) => genres.length === 1 ? 'Genre' : 'Genres';

const getGenre = (genres) => {
  if (genres.length === 1) { // если жанр один
    return `<span class="film-details__genre">${genres}</span>`;

  } else { // если жанров много

    const glueTags = (accumulator, currentValue) => {
      accumulator += `<span class="film-details__genre">${currentValue}</span>`;
      return accumulator;
    };

    return genres.reduce(glueTags, '');
  }
};

/*  Переводим массив с именами в строку
   ========================================================================== */

const getName = (names) => {
  return names.length > 1 ? names.join(', ') : names + '';
};


export {
  defineNumberGenre,
  getGenre,
  getName
};
