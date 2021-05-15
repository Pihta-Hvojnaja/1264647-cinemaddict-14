
import {FilterType} from '../const.js';

/** Объект собирает данные для фильтра */
export const filter = {
  [FilterType.ALL]: (dataFilms) => dataFilms,

  [FilterType.WATCHLIST]: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.watchlist),

  [FilterType.HISTORY]: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.alreadyWatched),

  [FilterType.FAVORITES]: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.favorite),
};
