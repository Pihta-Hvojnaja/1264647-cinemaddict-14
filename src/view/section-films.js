
import AbstractView from './abstract.js';


const createSectionFilmsTemplate = () => {
  return `<section class="films">
            <section id="all-films" class="films-list">
              <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
              <div class="films-list__container">
              </div>
            </section>
            <section id="top-rated" class="films-list films-list--extra">
              <h2 class="films-list__title">Top rated</h2>
              <div class="films-list__container">
              </div>
            </section>
            <section id="most-commented" class="films-list films-list--extra">
              <h2 class="films-list__title">Most commented</h2>
              <div class="films-list__container">
              </div>
            </section>
          </section>`;
};


export default class SectionFilms extends AbstractView {
  constructor() {
    super();
    this._idCardFilm = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSectionFilmsTemplate();
  }

  getIdCardFilm() {
    return this._idCardFilm;
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }

  _isClickCardFilm(evt) {
    const currentElement = evt.target.className;
    return currentElement === 'film-card__poster' ||
            currentElement === 'film-card__title' ||
              currentElement === 'film-card__comments';
  }

  _clickHandler(evt) {
    evt.preventDefault();

    if (this._isClickCardFilm(evt)) {
      this._idCardFilm = evt.target.parentElement.id;
      this._callback.click();
    }
  }
}
