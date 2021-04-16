import dayjs from 'dayjs';
import { getDescription } from './util/util-film-card.js'; // Обрезает длинну описания
import { getRuntime } from './../util.js';
import { createElement } from './../util.js';


const FIRST_GENRE = 0;

const createFilmCardTemplate = (dataFilm) => {

  const { id, filmInfo, comments } = dataFilm;
  const { description, title, totalRating, release, runtime, genre, poster } = filmInfo;

  return `<article id="${id}" class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dayjs(release.date).format('YYYY')}</span>
            <span class="film-card__duration">${getRuntime(runtime)}</span>
              <span class="film-card__genre">${genre[FIRST_GENRE]}</span>
            </p>
            <img src="./${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${getDescription(description)}</p>
            <a class="film-card__comments">${comments.length} comments</a>
            <div class="film-card__controls">
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

export default class FilmCard {
  constructor(dataFilm) {
    this._dataFilm = dataFilm;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._dataFilm);
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
