
import { createElement } from './../util.js';

const createFooterStatisticsTemplate = (dataFilms) => {
  return `<p>${dataFilms.length} movies inside</p>`;
};

export default class SiteFooterStatistics {
  constructor(dataFilms) {
    this._dataFilms = dataFilms;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._dataFilms);
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
