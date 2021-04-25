/**
 * Топ рейтинга
 * @param {Array} dataFilms - массив данных фильмов
 * @returns {Array} - возвращает отсортированные по рейтингу массив данных
 */
export const getTopRated = (dataFilms) => dataFilms.slice()
  .sort((firstElement, secondElement) =>
    secondElement.filmInfo.totalRating - firstElement.filmInfo.totalRating);


/**
 * Топ комментариев
 * @param {Array} dataFilms - массив данных фильмов
 * @returns {Array} - возвращает отсортированные по кол-ву комментариев массив данных
 */
export const getMostCommented = (dataFilms) => dataFilms.slice()
  .sort((firstElement, secondElement) =>
    secondElement.comments.length - firstElement.comments.length);
