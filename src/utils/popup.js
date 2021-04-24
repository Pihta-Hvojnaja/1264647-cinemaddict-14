
/*  Функция поля жанры/жанр
   ========================================================================== */

export const defineNumberGenre = (genres) => genres.length === 1 ? 'Genre' : 'Genres';

export const getGenre = (genres) => {
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

export const getName = (names) => {
  return names.length > 1 ? names.join(', ') : names + '';
};


/*  Если кликнули по нужному элементу карточки фильма, возвращает true
   ========================================================================== */

export const isClickCardFilm = (evt) => {
  const currentElement = evt.target.className;
  return currentElement === 'film-card__poster' ||
          currentElement === 'film-card__title' ||
            currentElement === 'film-card__comments';
};
