
import dayjs from 'dayjs';

import {
  defineNumberGenre,
  getGenre,
  getName
} from './../utils/popup.js';

import { reformatRuntime } from '../utils/reformat-runtime.js';

import AbstractView from './abstract.js';


/**
 * Функция определяет статус кнопки
 * @param {boolean} status - статус поля данных
 * @returns {string} - атрибут checked или пустую строку
 */
const identifyCheckboxStatus = (status) => {
  return status ? 'checked ' : '';
};


const createPopupTemplate = (dataFilm) => {
  const { filmInfo, userDetails } = dataFilm;

  const { description, title, alternativeTitle, totalRating,
    release, runtime, genre, poster, ageRating, director,
    writers, actors,
  } = filmInfo;

  const { watchlist, alreadyWatched, favorite } = userDetails;

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="./${poster}" alt="">
                    <p class="film-details__age">${ageRating}+</p>
                  </div>
                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                      </div>
                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${totalRating}</p>
                      </div>
                    </div>
                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${getName(writers)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${getName(actors)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${dayjs(release.date).format('DD MMMM YYYY')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${reformatRuntime(runtime)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${release.releaseCountry}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">${defineNumberGenre(genre)}</td>
                        <td class="film-details__cell">
                          ${getGenre(genre)}
                        </td>
                      </tr>
                    </table>
                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>
                <section class="film-details__controls">
                  <input ${identifyCheckboxStatus(watchlist)}type="checkbox" class="film-details__control-input visually-hidden" id="watchlist-controls" name="watchlist">
                  <label for="watchlist-controls" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
                  <input ${identifyCheckboxStatus(alreadyWatched)}type="checkbox" class="film-details__control-input visually-hidden" id="watched-controls" name="watched">
                  <label for="watched-controls" class="film-details__control-label film-details__control-label--watched">Already watched</label>
                  <input ${identifyCheckboxStatus(favorite)}type="checkbox" class="film-details__control-input visually-hidden" id="favorite-controls" name="favorite">
                  <label for="favorite-controls" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
                </section>
              </div>
              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                </section>
              </div>
            </form>
          </section>`;
};

export default class Popup extends AbstractView {
  constructor(dataFilm) {
    super();
    this._dataFilm = dataFilm;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._dataFilm);
  }

  setCloseClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setWatchlistChangeHandler(callback) {
    this._callback.watchlistChange = callback;
    this.getElement().querySelector('#watchlist-controls')
      .addEventListener('change', this._watchlistChangeHandler);
  }

  setWatchedChangeHandler(callback) {
    this._callback.watchedChange = callback;
    this.getElement().querySelector('#watched-controls')
      .addEventListener('change', this._watchedChangeHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.favoriteChange = callback;
    this.getElement().querySelector('#favorite-controls')
      .addEventListener('change', this._favoriteChangeHandler);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchlistChangeHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistChange();
  }

  _watchedChangeHandler(evt) {
    evt.preventDefault();
    this._callback.watchedChange();
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteChange();
  }
}
