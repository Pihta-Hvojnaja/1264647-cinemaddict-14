
import dayjs from 'dayjs';


/**
 * Ф-ция обновляет поле Watchlist объекта dataFilm / ф-ция копирует объект
 * @param {Object} dataFilm - исходный объект
 * @returns {Object} - обновленная копия dataFilm
 */
const updateDataWatchlist = (dataFilm) => {
  return Object.assign(
    {},
    dataFilm,
    {
      userDetails: {
        watchlist: !dataFilm.userDetails.watchlist,
        alreadyWatched: dataFilm.userDetails.alreadyWatched,
        watchingDate: dataFilm.userDetails.watchingDate,
        favorite: dataFilm.userDetails.favorite,
      },
    },
  );
};


/**
 * Ф-ция обновляет поле Watched объекта dataFilm / ф-ция копирует объект
 * @param {Object} dataFilm - исходный объект
 * @returns {Object} - обновленная копия dataFilm
 */
const updateDataWatched = (dataFilm) => {
  const isAlreadyWatched = dataFilm.userDetails.watchingDate;

  return Object.assign(
    {},
    dataFilm,
    {
      userDetails: {
        watchlist: dataFilm.userDetails.watchlist,
        alreadyWatched: !dataFilm.userDetails.alreadyWatched,
        watchingDate: isAlreadyWatched ? null : dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        favorite: dataFilm.userDetails.favorite,
      },
    },
  );
};


/**
 * Ф-ция обновляет поле Favorite объекта dataFilm / ф-ция копирует объект
 * @param {Object} dataFilm - исходный объект
 * @returns {Object} - обновленная копия dataFilm
 */
const updateDataFavorite = (dataFilm) => {
  return Object.assign(
    {},
    dataFilm,
    {
      userDetails: {
        watchlist: dataFilm.userDetails.watchlist,
        alreadyWatched: dataFilm.userDetails.alreadyWatched,
        watchingDate: dataFilm.userDetails.watchingDate,
        favorite: !dataFilm.userDetails.favorite,
      },
    },
  );
};


export {
  updateDataWatchlist,
  updateDataWatched,
  updateDataFavorite
};
