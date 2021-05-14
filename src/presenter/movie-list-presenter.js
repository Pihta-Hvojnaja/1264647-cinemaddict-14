
import { render, removeComponent } from '../utils/render.js';
import { sortDate, sortTopRated, sortMostCommented } from '../utils/sort-data.js';

import { SortType, UpdateType, UserAction } from '../const.js';

import SortView from '../view/sort.js';

import NoFilmsView from '../view/no-films.js';
import SectionFilmsView from '../view/section-films.js';

import ButtonShowMoreView from '../view/button-show-more.js';

import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';


const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_LIST_EXTRA = 2;


export default class MovieListPresenter {

  constructor(listFilmsContainer, popupContainer, moviesModel, commentsModel) {
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;

    this._listFilmsContainer = listFilmsContainer;
    this._popupContainer = popupContainer;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._noFilmsComponent = new NoFilmsView();
    this._sectionFilmsComponent = null;
    this._buttonShowMoreComponent = null;
    this._popupPresenter = new PopupPresenter(this._popupContainer);

    this._moviePresenters = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onCardFilmClick = this._onCardFilmClick.bind(this);
    this._onButtomShowMoreClick = this._onButtomShowMoreClick.bind(this);

    this._onViewAction = this._onViewAction.bind(this);
    this._onMoviesModelEvent = this._onMoviesModelEvent.bind(this);
    this._onCommentsModelEvent = this._onCommentsModelEvent.bind(this);

    this._moviesModel.addObserver(this._onMoviesModelEvent);
    this._commentsModel.addObserver(this._onCommentsModelEvent);
  }

  init() {
    this._dataTopRatedFilms = null;
    this._dataMostCommentedFilms = null;

    this._renderBoardFilms();
  }

  _getDataFilms(sortType = this._currentSortType) {
    const copyDataFilms = this._moviesModel.getDataFilms().slice();

    switch (sortType) {
      case SortType.DATE:
        return sortDate(copyDataFilms);
      case SortType.RATING:
        return sortTopRated(copyDataFilms);
      case SortType.COUNT_COMMENTS:
        return sortMostCommented(copyDataFilms);
      case SortType.DEFAULT:
        return this._moviesModel.getDataFilms();
    }
  }

  _getDataComments() {
    return this._commentsModel.getDataComments();
  }

  /** Отрисовывает список с кнопками сортировки */
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
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
    const moviePresenter = new MoviePresenter(container, this._onViewAction);
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
    if (this._getDataFilms().length > this._renderedFilmCount) {
      if (this._buttonShowMoreComponent !== null) {
        this._buttonShowMoreComponent = null;
      }

      this._buttonShowMoreComponent = new ButtonShowMoreView();
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
    this._dataTopRatedFilms = this._getDataFilms(SortType.RATING);
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

    this._dataMostCommentedFilms = this._getDataFilms(SortType.COUNT_COMMENTS);
    const countCommentsFirstElement = this._dataMostCommentedFilms[0].comments.length;

    this._sectionFilmsComponent.isMostCommentedFilms(countCommentsFirstElement);

    if (countCommentsFirstElement === 0) {
      return;
    }

    this._dataMostCommentedFilms.slice(0, FILM_COUNT_LIST_EXTRA)
      .forEach((dataFilm) => this._renderFilm(this._sectionFilmsComponent.getMostCommentedContainerElement(), dataFilm));
  }

  /** Отрисовывает панель со списками фильмов или заглушку, если фильмов нет  */
  _renderBoardFilms() {
    this._renderSort();

    if (this._getDataFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    const dataFilms = (this._currentSortType === SortType.RATING) ?
      this._dataTopRatedFilms : this._getDataFilms(this._currentSortType);

    this._sectionFilmsComponent = new SectionFilmsView();

    this._renderSectionFilms();
    this._renderAllFilms(dataFilms, 0, this._renderedFilmCount);
    this._renderButtomShowMore();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms(this._dataMostCommentedFilms);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  /** Очищает все списки фильмов */
  _clearBoardFilms({renderedFilmCount = false, resetSortType = false} = {}) {
    this._moviePresenters.forEach((presenter) => presenter.destroy());
    this._moviePresenters = [];

    removeComponent(this._sortComponent);
    removeComponent(this._noFilmsComponent);
    removeComponent(this._sectionFilmsComponent);
    removeComponent(this._buttonShowMoreComponent);

    if (renderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  /** Функция находит по id выбранной карточки данные фильма */
  _getDataCurrentFilm() {
    return this._getDataFilms().find(
      (dataFilm) => dataFilm.id === this._sectionFilmsComponent.getIdCardFilm(),
    );
  }

  /** Отрисовывает попап */
  _renderPopup() {
    this._popupPresenter.init(
      this._getDataCurrentFilm(),
      this._getDataComments(),
      this._onViewAction,
      this._onCommentsChange,
    );
  }

  /** Обработчик сортировки */
  _onSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoardFilms({renderedFilmCount: true});
    this._renderBoardFilms();
  }

  /** Обработчик кнопки Show More */
  _onButtomShowMoreClick() {
    this._renderAllFilms(
      this._getDataFilms(),
      this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP,
    );

    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._getDataFilms().length) {
      removeComponent(this._buttonShowMoreComponent);
    }
  }

  /** Обработчик клика по карточке фильма */
  _onCardFilmClick() {
    this._renderPopup();
  }

  _onViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._moviesModel.updateDataFilms(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.updateDataComments(updateType, update);
    }
  }

  _onMoviesModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._popupPresenter.setDataFilm(data);

        this._moviePresenters.forEach(
          (presenter) => {
            if (presenter.getId() === data.id) {
              presenter.init(data);
            }
          },
        );
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  _onCommentsModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MAJOR:
        this._popupPresenter.replaceComments();
        this._renderMostCommentedFilms();
        break;
    }
  }
}
