
import Observer from './observer.js';

export default class MoviesModel extends Observer {
  constructor() {
    super();
    this._dataFilms = [];
  }

  getDataFilms() {
    return this._dataFilms;
  }

  setDataFilms(updateType, dataFilms) {
    this._dataFilms = dataFilms.slice();

    this._notify(updateType);
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

  static adaptToClient(dataFilm) {
    const adaptedDataFilm = Object.assign(
      {},
      dataFilm,
      {
        filmInfo: {
          title: dataFilm.film_info.title,
          alternativeTitle: dataFilm.film_info.alternative_title,
          totalRating: dataFilm.film_info.total_rating,
          poster: dataFilm.film_info.poster,
          ageRating: dataFilm.film_info.age_rating,
          director: dataFilm.film_info.director,
          writers: dataFilm.film_info.writers,
          actors: dataFilm.film_info.actors,

          release: {
            date: dataFilm.film_info.release.date,
            releaseCountry: dataFilm.film_info.release.release_country,
          },

          runtime: dataFilm.film_info.runtime,
          genre: dataFilm.film_info.genre,
          description: dataFilm.film_info.description,
        },

        userDetails: {
          watchlist: dataFilm.user_details.watchlist,
          alreadyWatched: dataFilm.user_details.already_watched,
          watchingDate: dataFilm.user_details.watching_date,
          favorite: dataFilm.user_details.favorite,
        },
      },
    );

    delete adaptedDataFilm.film_info;
    delete adaptedDataFilm.user_details;

    return adaptedDataFilm;
  }

  static adaptToServer(dataFilm) {

    const adaptedDataFilm = Object.assign(
      {},
      dataFilm,
      {
        film_info: {
          title: dataFilm.filmInfo.title,
          alternative_title: dataFilm.filmInfo.alternativeTitle,
          total_rating: dataFilm.filmInfo.totalRating,
          poster: dataFilm.filmInfo.poster,
          age_rating: dataFilm.filmInfo.ageRating,
          director: dataFilm.filmInfo.director,
          writers: dataFilm.filmInfo.writers,
          actors: dataFilm.filmInfo.actors,

          release: {
            date: dataFilm.filmInfo.release.date,
            release_country: dataFilm.filmInfo.release.releaseCountry,
          },

          runtime: dataFilm.filmInfo.runtime,
          genre: dataFilm.filmInfo.genre,
          description: dataFilm.filmInfo.description,
        },

        user_details: {
          watchlist: dataFilm.userDetails.watchlist,
          already_watched: dataFilm.userDetails.alreadyWatched,
          watching_date: dataFilm.userDetails.watchingDate,
          favorite: dataFilm.userDetails.favorite,
        },
      },
    );

    delete adaptedDataFilm.filmInfo;
    delete adaptedDataFilm.userDetails;

    return adaptedDataFilm;
  }
}
