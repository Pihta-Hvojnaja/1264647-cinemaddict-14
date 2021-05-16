
import AbstractView from './abstract.js';
import {FilterType} from '../const.js';


/**
 * Ф-ция создает разметку кнопок фильтра
 * @param {Object} filter - объект отфильтрованных данных
 * @returns {string} - возвращает заполненный шаблон разметки кнопок фильтра
 */
const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return `<a id="${type}" href="#${type}" class="main-navigation__item${type === currentFilterType ? ' main-navigation__item--active': ''}">
            ${name}
            ${type !== FilterType.ALL ?  `<span class="main-navigation__item-count">${count}</span>` : ''}
          </a>`;
};


const createSiteFilterTemplate = (filters, currentFilterType) => {

  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  const statusButtonStatistic = currentFilterType === FilterType.ADDITIONAL ?
    ' main-navigation__item--active': '';

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${filterItemsTemplate}
            </div>
            <a id="additional" href="#stats" class="main-navigation__additional${statusButtonStatistic}">Stats</a>
          </nav>`;
};


export default class SiteFilter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters, this._currentFilterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.id);
  }
}
