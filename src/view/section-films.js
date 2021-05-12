
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

    this._allFilmsElement = this.getElement().querySelector('#all-films');
    this._filmsContainerElement = this._allFilmsElement.querySelector('.films-list__container');
    this._topRatedElement = this.getElement().querySelector('#top-rated');
    this._topRatedContainerElement = this._topRatedElement.querySelector('.films-list__container');
    this._mostCommentedElement = this.getElement().querySelector('#most-commented');
    this._mostCommentedContainerElement = this._mostCommentedElement.querySelector('.films-list__container');
  }

  getTemplate() {
    return createSectionFilmsTemplate();
  }

  getAllFilmsElement () {
    return this._allFilmsElement;
  }

  getFilmsContainerElement() {
    return this._filmsContainerElement;
  }

  getTopRatedElement() {
    return this._topRatedElement;
  }

  getTopRatedContainerElement() {
    return this._topRatedContainerElement;
  }

  getMostCommentedElement() {
    return this._mostCommentedElement;
  }

  getMostCommentedContainerElement() {
    return this._mostCommentedContainerElement;
  }

  getIdCardFilm() {
    return this._idCardFilm;
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }

  isTopRatedFilms() {
    this._topRatedElement.classList.add('films-list--extra-none');
    this._mostCommentedElement.classList.add('films-list--no-border');
  }

  isMostCommentedFilms(isComments) {
    if (!isComments) {
      this._mostCommentedElement.classList.add('films-list--extra-none');
      return;
    }
    this._mostCommentedElement.classList.remove('films-list--extra-none');
  }

  clearMostCommentedContainerElement() {
    this._mostCommentedContainerElement.innerHTML = '';
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
