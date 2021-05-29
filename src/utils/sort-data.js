
import dayjs from 'dayjs';


/**
 * Ф-ция сортирует по дате (от более современных)
 * @param {Array} dataFilms - массив данных фильмов
 * @returns {Array} - возвращает отсортированный по дате массив данных
 */
const sortDate = (dataFilms) => dataFilms.slice()
  .sort((filmA, filmB) =>
    dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date)));


/**
 * Топ рейтинга
 * @param {Array} dataFilms - массив данных фильмов
 * @returns {Array} - возвращает отсортированный по рейтингу массив данных
 */
const sortTopRated = (dataFilms) => dataFilms.slice()
  .sort((firstElement, secondElement) =>
    secondElement.filmInfo.totalRating - firstElement.filmInfo.totalRating);


/**
 * Топ комментариев
 * @param {Array} dataFilms - массив данных фильмов
 * @returns {Array} - возвращает отсортированный по кол-ву комментариев массив данных
 */
const sortMostCommented = (dataFilms) => dataFilms.slice()
  .sort((firstElement, secondElement) =>
    secondElement.comments.length - firstElement.comments.length);


export {
  sortDate,
  sortTopRated,
  sortMostCommented
};
