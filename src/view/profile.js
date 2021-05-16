
import AbstractView from './abstract.js';


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

  return `<p class="profile__rating">${status}</p>`;
};


/**
 * Ф-ция создаеш шаблон профиля
 * @param {Object} filter - объект данных фильтра
 * @returns {string} - возвращает заполненную разметку шаблона профиля
 */
const createProfileTemplate = (filter) => {

  return history.count === 0 ? ' ' : `<section class="header__profile profile">
                                        ${createFilterItemTemplate(filter.count)}
                                        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
                                      </section>`;
};


export default class Profile extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createProfileTemplate(this._filter);
  }
}
