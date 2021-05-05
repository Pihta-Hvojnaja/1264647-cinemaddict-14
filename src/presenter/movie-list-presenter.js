
import { render, removeComponent } from '../utils/render.js';
import { sortDate, sortTopRated, sortMostCommented } from '../utils/sort-data.js';
import { updateItems, removeItemFromItems } from '../utils/update-items.js';

import { SortType } from '../const.js';

import SortView from '../view/sort.js';

import NoFilmsView from '../view/no-films.js';
import SectionFilmsView from '../view/section-films.js';

import ButtonShowMoreView from '../view/button-show-more.js';

import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';


const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_LIST_EXTRA = 2;


export default class MovieListPresenter {

  constructor(listFilmsContainer, popupContainer) {
    this._listFilmsContainer = listFilmsContainer;
    this._popupContainer = popupContainer;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._noFilmsComponent = new NoFilmsView();
    this._sectionFilmsComponent = null;
    this._buttonShowMoreComponent = new ButtonShowMoreView();
    this._popupPresenter = new PopupPresenter(this._popupContainer);

    this._moviePresenters = [];

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

    this._dataTopRatedFilms = null;
    this._dataMostCommentedFilms = null;

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
      .forEach((dataFilm) => this._renderFilm(this._sectionFilmsComponent.getFilmsContainerElement(), dataFilm));
  }

  /** Отрисовывает кнопку Show more */
  _renderButtomShowMore() {
    if (this._dataFilms.length > FILM_COUNT_PER_STEP) {
      render(this._sectionFilmsComponent.getAllFilmsElement(), this._buttonShowMoreComponent);
      this._buttonShowMoreComponent.setClickHandler(this._onButtomShowMoreClick);
    }
  }

  /** Очищает список фильмов заданной секции */
  _clearSectionFilms(idSectionFilm) {
    let newMoviePresenters = [];
    this._moviePresenters.forEach(
      (presenter) => {
        if (presenter.getIdParentSection() === idSectionFilm) {
          presenter.destroy();
          return;
        }

        newMoviePresenters.push(presenter);
      });

    this._moviePresenters = newMoviePresenters.slice();
    newMoviePresenters = null;
  }

  /** Отрисовывает карточки в секции Top Reted */
  _renderTopRatedFilms() {
    this._dataTopRatedFilms = this._sortFilms(this._dataFilms, SortType.RATING);
    const ratingFirstElement = this._dataTopRatedFilms[0].filmInfo.totalRating;

    if (ratingFirstElement === 0) {
      this._sectionFilmsComponent.isTopRatedFilms();
      return;
    }

    this._dataTopRatedFilms.slice(0, FILM_COUNT_LIST_EXTRA)
      .forEach((dataFilm) => this._renderFilm(this._sectionFilmsComponent.getTopRatedContainerElement(), dataFilm));
  }

  /** Отрисовывает карточки в секции Most Commented */
  _renderMostCommentedFilms() {

    if (this._dataMostCommentedFilms) {
      this._clearSectionFilms(this._sectionFilmsComponent.getMostCommentedElement().id);
    }


    this._dataMostCommentedFilms = this._sortFilms(this._dataFilms, SortType.COUNT_COMMENTS);
    const countCommentsFirstElement = this._dataMostCommentedFilms[0].comments.length;

    this._sectionFilmsComponent.isMostCommentedFilms(countCommentsFirstElement);

    if (countCommentsFirstElement === 0) {
      return;
    }

    this._dataMostCommentedFilms.slice(0, FILM_COUNT_LIST_EXTRA)
      .forEach((dataFilm) => this._renderFilm(this._sectionFilmsComponent.getMostCommentedContainerElement(), dataFilm));
  }

  /** Отрисовывает все списки фильмов */
  _renderListFilms(sortType) {

    this._dataFilms = (sortType === sortType.RATING) ?
      this._dataTopRatedFilms : this._sortFilms(this._dataFilms, sortType);

    this._renderAllFilms(this._dataFilms, 0, FILM_COUNT_PER_STEP);
    this._renderButtomShowMore();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms(this._dataMostCommentedFilms);
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

    this._sectionFilmsComponent = new SectionFilmsView();

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
    this._popupPresenter.replaceComments();
    this._renderMostCommentedFilms();
  }
}
