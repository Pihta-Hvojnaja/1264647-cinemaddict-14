import dayjs from 'dayjs';
import { clipDescription } from '../utils/film-card.js';
import { reformatRuntime } from '../utils/reformat-runtime.js';

import AbstractView from './abstract.js';


const FIRST_GENRE = 0;


/**
 * Функция определяет статус кнопки
 * @param {boolean} status - статус поля данных
 * @returns {string} - css-класс или пустую строку
 */
const identifyButtonStatus = (status) => {
  return status ? 'film-card__controls-item--active ' : '';
};


const createFilmCardTemplate = (dataFilm) => {

  const { id, filmInfo, comments, userDetails } = dataFilm;
  const { description, title, totalRating, release, runtime, genre, poster } = filmInfo;
  const { watchlist, alreadyWatched, favorite } = userDetails;

  return `<article id="${id}" class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dayjs(release.date).format('YYYY')}</span>
            <span class="film-card__duration">${reformatRuntime(runtime)}</span>
              <span class="film-card__genre">${genre[FIRST_GENRE]}</span>
            </p>
            <img src="./${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${clipDescription(description)}</p>
            <a class="film-card__comments">${comments.length} comments</a>
            <div class="film-card__controls">
              <button class="${identifyButtonStatus(watchlist)}film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
              <button class="${identifyButtonStatus(alreadyWatched)}film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
              <button class="${identifyButtonStatus(favorite)}film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

export default class CardFilm extends AbstractView {
  constructor(dataFilm) {
    super();
    this._dataFilm = dataFilm;

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._dataFilm);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
