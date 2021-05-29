
import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (dataFilms) => {
  return `<p>${dataFilms.length} movies inside</p>`;
};

export default class SiteFooterStatistics extends AbstractView {
  constructor(dataFilms) {
    super();
    this._dataFilms = dataFilms;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._dataFilms);
  }
}
