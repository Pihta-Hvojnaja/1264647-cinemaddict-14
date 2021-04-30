
import AbstractView from './abstract.js';

const FIRST_LETTER = 0;


/**
 * Ф-ция создает разметку кнопок фильтра
 * @param {Object} filter - объект отфильтрованных данных
 * @returns {string} - возвращает заполненный шаблон разметки кнопок фильтра
 */
const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item">
            ${name[FIRST_LETTER].toUpperCase() + name.slice(1)}
            <span class="main-navigation__item-count">
              ${count}
            </span>
          </a>`;
};


const createSiteFilterTemplate = (filters) => {

  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
              ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};


export default class SiteFilter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters);
  }
}
