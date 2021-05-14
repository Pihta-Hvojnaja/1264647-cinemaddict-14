
import Observer from './observer.js';

export default class MoviesModel extends Observer {
  constructor() {
    super();
    this._dataFilms;
  }

  getDataFilms() {
    return this._dataFilms;
  }

  setDataFilms(dataFilms) {
    this._dataFilms = dataFilms.slice();
  }

  updateDataFilms(updateType, updateDataFilm) {
    const index = this._dataFilms.findIndex((dataFilm) => dataFilm.id === updateDataFilm.id);

    if (index === -1) {
      return this._dataFilms;
    }

    this._dataFilms = [
      ...this._dataFilms.slice(0, index),
      updateDataFilm,
      ...this._dataFilms.slice(index + 1),
    ];

    this._notify(updateType, updateDataFilm);
  }

  deleteDataFilm(updateType, updateDataFilm) {
    const index = this._dataFilms.findIndex((dataFilm) => dataFilm.id === updateDataFilm.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._dataFilms = [
      ...this._dataFilms.slice(0, index),
      ...this._dataFilms.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
