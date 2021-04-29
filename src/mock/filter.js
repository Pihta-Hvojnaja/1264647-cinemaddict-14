
/** Объект собирает данные для фильтра */
const taskToFilterFilms = {
  watchlist: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.watchlist)
    .length,

  history:   (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.alreadyWatched)
    .length,

  favorites: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.favorite)
    .length,
};


/**
 * Функция преобразует данные для фильтра
 * @param {Array} dataFilms - массив данных
 * @returns {Object} - возвращает преобразованный объект данных
 */
export const generateFilter = (dataFilms) => {
  return Object.entries(taskToFilterFilms).map(([filterName, countTasks]) => {
    return {
      name: filterName,
      count: countTasks(dataFilms),
    };
  });
};
