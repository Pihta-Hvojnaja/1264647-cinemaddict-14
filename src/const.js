
/** Коллекция
 *  @type {Object} - переменная хранит типы сортировки данных
 */
export const SortType = {
  DEFAULT: 'default',
  DATE: 'sort-by-date',
  RATING: 'sort-by-rating',
  COUNT_COMMENTS: 'sort-by-count-comments',
};


/** Коллекция
 *  @type {Object} - переменная хранит типы действий пользователя
 */
export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  //ADD_FILM: 'ADD_FILM',
  DELETE_COMMENT: 'DELETE_COMMENT',
};


/** Коллекция
 *  @type {Object} - переменная хранит типы обновлений
 */
export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
