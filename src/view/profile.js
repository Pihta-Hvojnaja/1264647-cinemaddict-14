
import AbstractView from './abstract.js';
import { createFilterItemTemplate } from '../utils/filter.js';

/**
 * Ф-ция создаеш шаблон профиля
 * @param {Object} filter - объект данных фильтра
 * @returns {string} - возвращает заполненную разметку шаблона профиля
 */
const createProfileTemplate = (filter) => {

  return filter === 0 ? ' ' : `<section class="header__profile profile">
                                        <p class="profile__rating">${createFilterItemTemplate(filter)}</p>
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
