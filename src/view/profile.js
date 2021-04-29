
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
 * @param {Object} filters - объект данных фильтра
 * @returns {string} - возвращает заполненную разметку шаблона профиля
 */
const createProfileTemplate = (filters) => {
  const [ , history] = filters;

  return history.count === 0 ? ' ' : `<section class="header__profile profile">
                                        ${createFilterItemTemplate(history.count)}
                                        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
                                      </section>`;
};


export default class Profile extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createProfileTemplate(this._filters);
  }
}
