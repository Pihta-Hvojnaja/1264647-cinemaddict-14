
import { createElement } from './../util.js';

const FIRST_LETTER = 0;


/*  Функция возвращает поле фильтра
   ========================================================================== */

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item">

          ${name[FIRST_LETTER].toUpperCase() + name.slice(1)}

          <span class="main-navigation__item-count">
          ${count}
          </span>

          </a>`;
};


/*  Функция возвращает поля фильтра и поле статистика
   ========================================================================== */

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

export default class SiteFilter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
