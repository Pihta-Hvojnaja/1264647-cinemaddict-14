

const ONE_HOUR = 60;

/**
 * @type {Object} - перечисление с типами эмоций
 */
const EmotionType = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};


/** Коллекция ФИЛЬТРА
 *  @type {Object} - переменная хранит типы фильтрации
 */
const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  ADDITIONAL: 'additional',
};


/** Коллекция СОРТИРОВКИ
 *  @type {Object} - переменная хранит типы сортировки данных
 */
const SortType = {
  DEFAULT: 'default',
  DATE: 'sort-by-date',
  RATING: 'sort-by-rating',
  COUNT_COMMENTS: 'sort-by-count-comments',
};


/** Коллекция ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЯ
 *  @type {Object} - переменная хранит типы действий пользователя
 */
const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};


/** Коллекция ОБНОВЛЕНИЙ
 *  @type {Object} - переменная хранит типы обновлений
 */
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  ADDITIONAL: 'ADDITIONAL',
  INIT: 'INIT',
};


/** Коллекция ВРЕМЕННЫХ ИНТЕРВАЛОВ
 *  @type {Object} - переменная хранит временные интервалы для фильтра статистики
 */
const TypeInterval = {
  ALL: 'all-time',
  TODAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};


export {
  ONE_HOUR,
  EmotionType,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  TypeInterval
};
