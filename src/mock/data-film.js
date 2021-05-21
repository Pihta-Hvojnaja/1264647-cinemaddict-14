
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

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


export const generateDataFilm = () => {
  const nameFilm = getRandomElement(FILM_NAMES);

  const alreadyWatched = Boolean(getRandomInteger(0, 1));

  const date = dayjs(
    `19${getRandomInteger(50, 69)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 31)}:${getRandomInteger(0, 23)}:${getRandomInteger(0, 59)}:${getRandomInteger(0, 59)}:${getRandomInteger(1, 1000)}`,
  ).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

  const watchingDate = dayjs(
    `202${getRandomInteger(0, 1)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 31)}:${getRandomInteger(0, 23)}:${getRandomInteger(0, 59)}:${getRandomInteger(0, 59)}:${getRandomInteger(1, 1000)}`,
  ).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');


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
        date: date,
        releaseCountry: 'Finland',
      },

      runtime: getRandomInteger(50, 140),
      genre: getArrayRandomLength(GENRES, 1),
      description: getRandomDescription(SOURCE_DESCRIPTION),
    },

    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: alreadyWatched,
      watchingDate: alreadyWatched ? watchingDate : null,
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
