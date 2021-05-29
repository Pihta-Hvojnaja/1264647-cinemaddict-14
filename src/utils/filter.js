
import { FilterType, TypeInterval } from '../const.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);


/**
 * Ф-ция возвращает поле рейтинга в профиле
 * @param {number} count - количество просмотренных фильмов
 * @returns {string} - возвращает разметку рейтинга в профиле
 */
const createFilterItemTemplate = (count) => {
  let status;

  if (count >= 1 && count <= 10) {
    status = 'Novice';

  } else if (count >= 11 && count <= 20) {
    status = 'Fan';

  } else {
    status = 'Movie Buff';
  }

  return status;
};


/**
 * Функция определяет просмотрен ли фильм в заданном промежутке времени
 * @param {Object} data - объект данных о просмотренных фильмах с методами работы с временными периодами
 * @param {Object} dataFilm - объект данных фильма
 * @param {string} typeInterval - тип временного промежутка
 * @returns {Boolean} - возвращает true или false
 */
const isInInterval = (data, dataFilm, typeInterval) => {
  const date = dayjs(dataFilm.userDetails.watchingDate).toDate();
  const dateFrom = dayjs(data.dateFrom(typeInterval)).toDate();
  const dateTo = dayjs(data.dateTo).toDate();

  return dayjs(date).isSame(dateFrom) ||
          dayjs(date).isBetween(dateFrom, dateTo) ||
            dayjs(date).isSame(dateTo);
};


/** Объект хранит фильтры для доски с фильмами */
const filter = {
  [FilterType.ALL]: (dataFilms) => dataFilms,

  [FilterType.WATCHLIST]: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.watchlist),

  [FilterType.HISTORY]: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.alreadyWatched),

  [FilterType.FAVORITES]: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.favorite),

  [FilterType.ADDITIONAL]: (dataFilms) => dataFilms
    .filter((dataFilm) => dataFilm.userDetails.watchingDate),
};


/** Объект хранит фильтры для статистики */
const filterTimeInterval = {
  [TypeInterval.ALL]: (data) => data.dataFilms,

  [TypeInterval.TODAY]: (data) => data.dataFilms
    .filter((dataFilm) => isInInterval(data, dataFilm, TypeInterval.TODAY)),

  [TypeInterval.WEEK]: (data) => data.dataFilms
    .filter((dataFilm) => isInInterval(data, dataFilm, TypeInterval.WEEK)),

  [TypeInterval.MONTH]: (data) => data.dataFilms
    .filter((dataFilm) => isInInterval(data, dataFilm, TypeInterval.MONTH)),

  [TypeInterval.YEAR]: (data) => data.dataFilms
    .filter((dataFilm) => isInInterval(data, dataFilm, TypeInterval.YEAR)),
};


export {
  createFilterItemTemplate,
  filter,
  filterTimeInterval
};
