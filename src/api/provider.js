
import MoviesModel from '../model/movies-model.js';
import { isOnline } from '../utils/is-online.js';

const getSyncedDataFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, storeKeyDataFilms, storeKeyDataComments) {
    this._api = api;
    this._store = store;
    this._storeKeyDataFilms = storeKeyDataFilms;
    this._storeKeyDataComments = storeKeyDataComments;
  }

  getDataFilms() {
    if (isOnline()) {
      return this._api.getDataFilms()
        .then((dataFilms) => {
          const items = createStoreStructure(dataFilms.map(MoviesModel.adaptToServer));
          this._store.setItems(this._storeKeyDataFilms, items);
          return dataFilms;
        });
    }

    const storeDataFilms = this._getStoreDataFilms();

    return Promise.resolve(storeDataFilms.map(MoviesModel.adaptToClient));
  }

  getDataComments(movieId) {
    if (isOnline()) {
      return this._api.getDataComments(movieId)
        .then((dataComments) => {
          this._store.setItem(this._storeKeyDataComments, movieId, dataComments);
          return dataComments;
        });
    }

    const storeDataComments = this._store.getItems(this._storeKeyDataComments)[movieId];

    if (storeDataComments) {
      return Promise.resolve(storeDataComments);
    }

    const countComments = this._getStoreDataFilms()[movieId].comments.length;
    if (countComments === 0) {
      return Promise.resolve([]);
    }

    return Promise.reject(new Error('Get comments failed'));
  }

  updateDataFilm(dataFilm) {
    if (isOnline()) {
      return this._api.updateDataFilm(dataFilm)
        .then((updatedDataFilm) => {
          this._store.setItem(this._storeKeyDataFilms, updatedDataFilm.id, MoviesModel.adaptToServer(updatedDataFilm));
          return updatedDataFilm;
        });
    }

    this._store.setItem(this._storeKeyDataFilms, dataFilm.id, MoviesModel.adaptToServer(Object.assign({}, dataFilm)));

    return Promise.resolve(dataFilm);
  }

  addDataComment(filmId, dataComment) {
    if (isOnline()) {
      return this._api.addDataComment(filmId, dataComment)
        .then((response) => {
          this._store.setItem(this._storeKeyDataFilms, filmId, MoviesModel.adaptToServer(response.movie));
          this._store.setItem(this._storeKeyDataComments, filmId, response.comments);

          return {
            movie: response.movie,
            comments: response.comments,
          };
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteDataComment(commentId, filmId) {
    if (isOnline()) {
      return this._api.deleteDataComment(commentId)
        .then(() => this._store.removeItem(this._storeKeyDataComments, filmId, commentId));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeDataFilms = Object.values(this._store.getItems(this._storeKeyDataFilms));

      return this._api.sync(storeDataFilms)
        .then((response) => {
          const items = createStoreStructure(getSyncedDataFilms(response.updated));
          this._store.setItems(this._storeKeyDataFilms, items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }

  _getStoreDataFilms() {
    return Object.values(this._store.getItems(this._storeKeyDataFilms));
  }
}
