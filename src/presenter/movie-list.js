
import { render, removeComponent } from '../utils/render.js';
import { sortDate, sortTopRated, sortMostCommented } from '../utils/sort-data.js';
import { updateItems, removeItemFromItems } from '../utils/update-items.js';

import { SortType } from '../const.js';

import SortView from '../view/sort.js';

import NoFilmsView from '../view/no-films.js';
import SectionFilmsView from '../view/section-films.js';

import ButtonShowMoreView from '../view/button-show-more.js';

import MoviePresenter from './movie.js';
import PopupPresenter from './popup.js';


const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_LIST_EXTRA = 2;


export default class MovieList {

  constructor(listFilmsContainer, popupContainer) {
    this._listFilmsContainer = listFilmsContainer;
    this._popupContainer = popupContainer;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._noFilmsComponent = new NoFilmsView();
    this._sectionFilmsComponent = new SectionFilmsView();
    this._buttonShowMoreComponent = new ButtonShowMoreView();

    this._moviePresenters = [];
    this._popupPresenter = new PopupPresenter(this._popupContainer);

    this._allFilmsElement = this._sectionFilmsComponent.getElement().querySelector('#all-films');
    this._filmsContainerElement = this._allFilmsElement.querySelector('.films-list__container');
    this._topRatedElement = this._sectionFilmsComponent.getElement().querySelector('#top-rated');
    this._topRatedContainerElement = this._topRatedElement.querySelector('.films-list__container');
    this._mostCommentedElement = this._sectionFilmsComponent.getElement().querySelector('#most-commented');
    this._mostCommentedContainerElement = this._mostCommentedElement.querySelector('.films-list__container');

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onCardFilmClick = this._onCardFilmClick.bind(this);
    this._onButtomShowMoreClick = this._onButtomShowMoreClick.bind(this);

    this._onFilmChange = this._onFilmChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
  }

  init(dataFilms, dataComments) {
    this._sourceDataFilms = dataFilms.slice();
    this._dataFilms = dataFilms.slice();
    this._dataComments = dataComments.slice();

    this._renderSort();
    this._renderBoardFilms();
  }

  /** Отрисовывает список с кнопками сортировки */
  _renderSort() {
    render(this._listFilmsContainer, this._sortComponent);
  }

  /** Отрисовывает заглушку для пустого списка фильмов */
  _renderNoFilms() {
    render(this._listFilmsContainer, this._noFilmsComponent);
  }

  /** Отрисовывает секции для карточек фильмов */
  _renderSectionFilms() {
    render(this._listFilmsContainer, this._sectionFilmsComponent);
    this._sectionFilmsComponent.setClickHandler(this._onCardFilmClick);
  }

  /** Отрисовывает карточку фильма */
  _renderFilm(container, dataFilm) {
    const moviePresenter = new MoviePresenter(container, this._onFilmChange);
    moviePresenter.init(dataFilm);
    this._moviePresenters.push(moviePresenter);
  }

  /** Отрисовывает основной список фильмов */
  _renderAllFilms(dataFilms, from, to) {
    dataFilms.slice(from, to)
      .forEach((dataFilm) => this._renderFilm(this._filmsContainerElement, dataFilm));
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
      this._mostCommentedElement.classList.add('films-list--no-border');
      return;
    }

    this._topRatedElement.classList.remove('films-list--extra-none');
    this._mostCommentedElement.classList.remove('films-list--no-border');
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
        .forEach((dataFilm) => this._renderFilm(this._topRatedContainerElement, dataFilm));
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
        .forEach((dataFilm) => this._renderFilm(this._mostCommentedContainerElement, dataFilm));
    }
  }

  /** Отрисовывает все списки фильмов */
  _renderListFilms(sortType) {
    this._dataFilms = this._sortFilms(this._dataFilms, sortType);

    const dataTopRatedFilms = (sortType === sortType.RATING) ?
      this._dataFilms : this._sortFilms(this._dataFilms, SortType.RATING);

    const dataMostCommentedFilms = this._sortFilms(this._dataFilms, SortType.COUNT_COMMENTS);

    this._renderAllFilms(this._dataFilms, 0, FILM_COUNT_PER_STEP);
    this._renderButtomShowMore();
    this._renderTopRatedFilms(dataTopRatedFilms);
    this._renderMostCommentedFilms(dataMostCommentedFilms);
  }

  /** Очищает все списки фильмов */
  _clearListFilms() {
    this._moviePresenters.forEach((presenter) => presenter.destroy());

    this._moviePresenters = [];
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    removeComponent(this._buttonShowMoreComponent);
  }

  /** Отрисовывает панель со списками фильмов или заглушку, если фильмов нет  */
  _renderBoardFilms() {

    if (this._dataFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSectionFilms();
    this._renderListFilms(SortType.DEFAULT);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  /** Функция находит по id выбранной карточки данные фильма */
  _getDataCurrentFilm() {
    return this._dataFilms.find(
      (dataFilm) => dataFilm.id === this._sectionFilmsComponent.getIdCardFilm(),
    );
  }

  /** Отрисовывает попап */
  _renderPopup() {
    const dataFilm = this._getDataCurrentFilm();
    this._popupPresenter.init(dataFilm, this._dataComments, this._onFilmChange, this._onCommentsChange);
  }

  /** Функция сортировки данных согласно выбранному типу сортировки */
  _sortFilms(dataFilms, sortType) {
    switch (sortType) {
      case SortType.DATE:
        return sortDate(dataFilms);
      case SortType.RATING:
        return sortTopRated(dataFilms);
      case SortType.COUNT_COMMENTS:
        return sortMostCommented(dataFilms);
      case SortType.DEFAULT:
        return this._sourceDataFilms.slice();
    }
  }

  /** Обработчик сортировки */
  _onSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._clearListFilms();
    this._renderListFilms(sortType);
    this._currentSortType = sortType;
  }

  /** Обработчик кнопки Show More */
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

  /** Обработчик клика по карточке фильма */
  _onCardFilmClick() {
    this._renderPopup();
  }

  /** Обработчик изменений данных карточки фильма */
  _onFilmChange(updatedFilm) {
    this._popupPresenter.setDataFilm(updatedFilm);

    this._dataFilms = updateItems(this._dataFilms, updatedFilm);

    /** @type {Array} - Содержит все копии презентеров карточки фильма */
    const moviePresenterCopies = this._moviePresenters
      .filter((presenter) => presenter.getId() === updatedFilm.id);

    moviePresenterCopies.forEach((presenter) => presenter.init(updatedFilm));
  }

  /** Обработчик изменений данных комментариев */
  _onCommentsChange(idComment) {
    this._dataComments = removeItemFromItems(this._dataComments, idComment);
  }
}
