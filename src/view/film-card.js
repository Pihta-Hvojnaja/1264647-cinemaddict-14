import dayjs from 'dayjs';
import { clipDescription } from './../utils/film-card.js';
import { reformatRuntime } from '../utils/reformat-runtime.js';

import AbstractView from './abstract.js';


const FIRST_GENRE = 0;

const createFilmCardTemplate = (dataFilm) => {

  const { id, filmInfo, comments } = dataFilm;
  const { description, title, totalRating, release, runtime, genre, poster } = filmInfo;

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
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

export default class CardFilm extends AbstractView {
  constructor(dataFilm) {
    super();
    this._dataFilm = dataFilm;
  }

  getTemplate() {
    return createFilmCardTemplate(this._dataFilm);
  }
}
