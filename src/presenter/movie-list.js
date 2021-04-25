
import { render, removeComponent } from '../utils/render.js';
import { getTopRated, getMostCommented } from '../utils/sort-data.js';

import SortView from '../view/sort.js';

import NoFilmsView from '../view/no-films.js';
import SectionFilmsView from '../view/section-films.js';

import CardFilmView from '../view/film-card.js';
import ButtonShowMoreView from '../view/button-show-more.js';

import PopupPresenter from './popup.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_LIST_EXTRA = 2;

/**
 * @class - презентер Films, управляет сортировкой, списком фильмов и попапом
 * @param {Object} listFilmsContainer
 * @param {Object} popupContainer
 */
export default class MovieList {

  constructor(listFilmsContainer, popupContainer) {
    this._listFilmsContainer = listFilmsContainer;
    this._popupContainer = popupContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._sortComponent = new SortView();
    this._noFilmsComponent = new NoFilmsView();
    this._sectionFilmsComponent = new SectionFilmsView();
    this._buttonShowMoreComponent = new ButtonShowMoreView();

    this._popupPresenter = new PopupPresenter(this._popupContainer);

    this._allFilmsElement = this._sectionFilmsComponent.getElement().querySelector('#all-films');
    this._filmsContainerElement = this._allFilmsElement.querySelector('.films-list__container');
    this._topRatedElement = this._sectionFilmsComponent.getElement().querySelector('#top-rated');
    this._topRatedContainerElement = this._topRatedElement.querySelector('.films-list__container');
    this._mostCommentedElement = this._sectionFilmsComponent.getElement().querySelector('#most-commented');
    this._mostCommentedContainerElement = this._mostCommentedElement.querySelector('.films-list__container');

    this._onButtomShowMoreClick = this._onButtomShowMoreClick.bind(this);
    this._onCardFilmClick = this._onCardFilmClick.bind(this);
  }

  /**
   * Функция-иницилизатор
   * @param {Array} dataFilms - данные фильмов
   */
  init(dataFilms) {
    this._dataFilms = dataFilms.slice();

    render(this._listFilmsContainer, this._sortComponent);
    this._renderSectionFilms();
    this._renderListFilms(dataFilms);
    this._sectionFilmsComponent.setClickHandler(this._onCardFilmClick);
  }

  /**
   * Отрисовывает пустой список
   */
  _renderNoFilms() {
    render(this._listFilmsContainer, this._noFilmsComponent);
  }

  /** Отрисовывает секции для карточек фильмов */
  _renderSectionFilms() {
    render(this._listFilmsContainer, this._sectionFilmsComponent);
  }

  /**
   * Отрисовывает основной список фильмов
   * @param {Array} dataFilms - данные о Фильмах
   * @param {number} from - отрисовать ОТ элемента
   * @param {number} to - отрисовать ДО элемента
   */
  _renderAllFilms(dataFilms, from, to) {
    dataFilms.slice(from, to)
      .forEach((dataFilm) => render(this._filmsContainerElement, new CardFilmView(dataFilm)));
  }

  /** Отрисовывает кнопку Show more */
  _renderButtomShowMore() {
    if (this._dataFilms.length > FILM_COUNT_PER_STEP) {
      render(this._allFilmsElement, this._buttonShowMoreComponent);
      this._buttonShowMoreComponent.setClickHandler(this._onButtomShowMoreClick);
    }
  }

  /**
   * Функция проверки рейтинга фильмов: если все фильмы имеют рейтинг "0", скрывает блок
   * @param {Object} firstElement - первый элемент массива: объект с описанием фильма
   * @returns {boolean} - если все фильмы имеют рейтинг "0", выйдет из функции
   */
  _isTopRatedFilms(firstElement) {
    if (firstElement.filmInfo.totalRating === 0) {
      this._topRatedElement.classList.add('films-list--extra-none');
      this._mostCommentedElement.classList.add('.films-list--no-border::before');
      return;
    }

    this._topRatedElement.classList.remove('films-list--extra-none');
    this._mostCommentedElement.classList.remove('.films-list--no-border::before');
    return true;
  }

  /**
   * Отрисовывает карточки в секции Top Reted
   * @param {Array} dataTopRatedFilms - отсортированные данные фильмов (по рейтингу -> от большего)
   */
  _renderTopRatedFilms(dataTopRatedFilms) {
    const firstElement = dataTopRatedFilms[0];

    if (this._isTopRatedFilms(firstElement)) {
      dataTopRatedFilms.slice(0, FILM_COUNT_LIST_EXTRA)
        .forEach((dataFilm) => render( this._topRatedContainerElement, new CardFilmView(dataFilm)));
    }
  }

  /**
   * Функция проверки кол-ва комментариев у фильмов: если все фильмы имеют "0" комментариев, скрывает блок
   * @param {Object} firstElement - первый элемент массива: объект с описанием фильма
   * @returns {boolean} - если все фильмы имеют "0" комментариев, выйдет из функции
   */
  _isMostCommentedFilms(firstElement) {
    if (firstElement.comments.length === 0) {
      this._mostCommentedElement.classList.add('films-list--extra-none');
      return;
    }

    this._mostCommentedElement.classList.remove('films-list--extra-none');
    return true;
  }

  /**
   * Отрисовывает карточки в секции Most Commented
   * @param {Array} dataMostCommentedFilms - отсортированные данные фильмов (по кол-ву комментариев -> от большего)
   */
  _renderMostCommentedFilms(dataMostCommentedFilms) {
    const firstElement = dataMostCommentedFilms[0];

    if (this._isMostCommentedFilms(firstElement)) {
      dataMostCommentedFilms.slice(0, FILM_COUNT_LIST_EXTRA)
        .forEach((dataFilm) => render( this._mostCommentedContainerElement, new CardFilmView(dataFilm)));
    }
  }

  /**
   * Отрисовывает все карточки фильмов на странице
   * @param {Array} dataFilms - данные фильмов
   * @returns - если база фильмов пуста, отрисовывает заглушку и выходит из функции
   */
  _renderListFilms(dataFilms) {
    if (dataFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    const dataTopRatedFilms = getTopRated(dataFilms);
    const dataMostCommentedFilms = getMostCommented(dataFilms);

    this._renderSectionFilms();
    this._renderAllFilms(this._dataFilms, 0, FILM_COUNT_PER_STEP);
    this._renderButtomShowMore();
    this._renderTopRatedFilms(dataTopRatedFilms);
    this._renderMostCommentedFilms(dataMostCommentedFilms);
  }

  _getDataCurrentFilm() {
    return this._dataFilms.find(
      (dataFilm) => dataFilm.id === this._sectionFilmsComponent.getIdCardFilm(),
    );
  }

  /**
   * @callback - обработчик кнопки Show More
   */
  _onButtomShowMoreClick() {
    this._renderAllFilms(
      this._dataFilms,
      this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP,
    );

    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._dataFilms.length) {
      removeComponent(this._buttonShowMoreComponent);
    }
  }

  _onCardFilmClick() {
    const dataFilm = this._getDataCurrentFilm();
    this._popupPresenter.init(dataFilm);
  }
}
