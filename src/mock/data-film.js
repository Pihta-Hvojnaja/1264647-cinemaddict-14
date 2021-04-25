
import { nanoid } from 'nanoid';

import {
  FILM_NAMES,
  POSTER_ADDRESSES,
  SOURCE_DESCRIPTION,
  GENRES,
  DIRECTORS,
  COMMENTS
} from './const-data.js';

import {
  getRandomInteger,
  getRandomInclusive,
  getRandomElement,
  getArrayRandomLength,
  getRandomDescription
} from './util-data.js';


/*  Функция генерации данных для карточек и попапа
   ========================================================================== */

export const generateDataFilm = () => {
  const nameFilm = getRandomElement(FILM_NAMES);

  return {
    id: nanoid(),
    comments: getArrayRandomLength(COMMENTS),

    filmInfo: {
      title: nameFilm,
      alternativeTitle: nameFilm,
      totalRating: getRandomInclusive(2, 10, 1),
      poster: getRandomElement(POSTER_ADDRESSES),
      ageRating: getRandomInteger(14, 18),
      director: getRandomElement(DIRECTORS),
      writers: getArrayRandomLength(DIRECTORS, 1),
      actors: getArrayRandomLength(DIRECTORS, 1),

      release: {
        date: `${getRandomInteger(1959, 1970)}-0${getRandomInteger(1, 9)}-0${getRandomInteger(1, 9)}T00:00:00.000Z`,
        releaseCountry: 'Finland',
      },

      runtime: getRandomInteger(50, 140),
      genre: getArrayRandomLength(GENRES, 1),
      description: getRandomDescription(SOURCE_DESCRIPTION),
    },

    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
