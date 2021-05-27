
import { filter } from '../utils/filter.js';
import { render, removeComponent } from '../utils/render.js';
import { sortDate, sortTopRated, sortMostCommented } from '../utils/sort-data.js';
import { isOnline } from '../utils/is-online.js';
import { toast } from '../utils/toast.js';

import { FilterType, SortType, UpdateType, UserAction } from '../const.js';

import SortView from '../view/sort.js';
import LoadingView from '../view/loading.js';
import NoFilmsView from '../view/no-films.js';
import SectionFilmsView from '../view/section-films.js';
import ButtonShowMoreView from '../view/button-show-more.js';
import StatisticsView from '../view/statistics.js';

import MoviePresenter from './movie-presenter.js';
import PopupPresenter, {State as MoviePresenterViewState} from './popup-presenter.js';


const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_LIST_EXTRA = 2;


export default class MovieListPresenter {

  constructor(
    listFilmsContainer,
    popupContainer,
    moviesModel,
    commentsModel,
    filterModel,
    filterPresenter,
    api) {

    this._listFilmsContainer = listFilmsContainer;
    this._popupContainer = popupContainer;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._filterPresenter = filterPresenter;
    this._api = api;

    this._isLoading = true;
    this._dataCurrentFilm = null;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._loadingComponent = new LoadingView();
    this._noFilmsComponent = new NoFilmsView();
    this._sectionFilmsComponent = null;
    this._buttonShowMoreComponent = null;
    this._statisticsComponent = null;

    this._popupPresenter = new PopupPresenter(this._popupContainer, this._api);
    this._moviePresenters = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onCardFilmClick = this._onCardFilmClick.bind(this);
    this._onButtomShowMoreClick = this._onButtomShowMoreClick.bind(this);

    this._onViewAction = this._onViewAction.bind(this);
    this._onMoviesModelEvent = this._onMoviesModelEvent.bind(this);
    this._onCommentsModelEvent = this._onCommentsModelEvent.bind(this);

    this._moviesModel.addObserver(this._onMoviesModelEvent);
    this._filterModel.addObserver(this._onMoviesModelEvent);
    this._commentsModel.addObserver(this._onCommentsModelEvent);
  }

  init() {
    this._dataTopRatedFilms = null;
    this._dataMostCommentedFilms = null;

    this._renderBoardFilms();
  }

  _getDataFilms(sortType = this._currentSortType) {
    this._filterType = this._filterModel.getFilter();

    const dataFilms = this._moviesModel.getDataFilms();
    const filtredDataFilms = filter[this._filterType](dataFilms);

    if (this._filterType === FilterType.ADDITIONAL) {
      return filtredDataFilms;
    }

    switch (sortType) {
      case SortType.DATE:
        return sortDate(filtredDataFilms);
      case SortType.RATING:
        return sortTopRated(filtredDataFilms);
      case SortType.COUNT_COMMENTS:
        return sortMostCommented(filtredDataFilms);
      case SortType.DEFAULT:
        return filtredDataFilms;
    }
  }

  _getDataCurrentFilm() {
    return this._getDataFilms().find(
      (dataFilm) => dataFilm.id === this._sectionFilmsComponent.getIdCardFilm(),
    );
  }

  _renderLoading() {
    render(this._listFilmsContainer, this._loadingComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._listFilmsContainer, this._sortComponent);
  }

  _renderNoFilms() {
    render(this._listFilmsContainer, this._noFilmsComponent);
  }

  _renderSectionFilms() {
    render(this._listFilmsContainer, this._sectionFilmsComponent);
    this._sectionFilmsComponent.setClickHandler(this._onCardFilmClick);
  }

  _renderFilm(container, dataFilm) {
    const moviePresenter = new MoviePresenter(container, this._onViewAction, this._filterType);
    moviePresenter.init(dataFilm);
    this._moviePresenters.push(moviePresenter);
  }

  _renderAllFilms(dataFilms, from, to) {
    dataFilms.slice(from, to)
      .forEach((dataFilm) => this._renderFilm(this._sectionFilmsComponent.getFilmsContainerElement(), dataFilm));
  }

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

  _renderTopRatedFilms() {
    const ratingFirstElement = this._dataTopRatedFilms[0].filmInfo.totalRating;

    if (ratingFirstElement === 0) {
      this._sectionFilmsComponent.isTopRatedFilms();
      return;
    }

    this._dataTopRatedFilms.slice(0, FILM_COUNT_LIST_EXTRA)
      .forEach((dataFilm) => this._renderFilm(this._sectionFilmsComponent.getTopRatedContainerElement(), dataFilm));
  }

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

  _renderBoardFilms() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderSort();

    if (this._getDataFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    this._dataTopRatedFilms = this._getDataFilms(SortType.RATING);

    const dataFilms = (this._currentSortType === SortType.RATING) ?
      this._dataTopRatedFilms : this._getDataFilms(this._currentSortType);

    this._sectionFilmsComponent = new SectionFilmsView();

    this._renderSectionFilms();
    this._renderAllFilms(dataFilms, 0, this._renderedFilmCount);
    this._renderButtomShowMore();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderPopup() {
    this._popupPresenter.init(
      this._dataCurrentFilm,
      this._commentsModel,
      this._onViewAction,
      this._filterType,
    );
  }

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

  _clearBoardFilms({renderedFilmCount = false, resetSortType = false} = {}) {
    if (this._statisticsComponent) {
      removeComponent(this._statisticsComponent);
      this._statisticsComponent = null;

    } else {
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
  }

  _sendDataFilmPopup(data) {
    if (this._popupPresenter.getPopupComponent()) {
      this._popupPresenter.setDataFilm(data);
    }
  }

  _replaceCurrentCardsFilm(data) {
    this._moviePresenters.forEach(
      (presenter) => {
        if (presenter.getId() === data.id) {
          presenter.init(data);
        }
      },
    );
  }

  _onSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoardFilms({renderedFilmCount: true});
    this._renderBoardFilms();
  }

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

  _onCardFilmClick() {
    this._dataCurrentFilm = this._getDataCurrentFilm();
    this._renderPopup();
  }

  _onViewAction(actionType, updateType, updateDataFilm, updateDataComment) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateDataFilm(updateDataFilm)
          .then(() => this._moviesModel.updateDataFilms(updateDataFilm, updateType));
        break;
      case UserAction.ADD_COMMENT:
        if (!isOnline()) {
          toast('You can\'t delete comment offline');
        }
        this._popupPresenter.setViewState(MoviePresenterViewState.ADD_COMMENT);
        this._api.addDataComment(updateDataFilm, updateDataComment)
          .then((response) => {
            this._commentsModel.setDataComments(response.comments, updateType);
            this._moviesModel.updateDataFilms(response.movie, updateType);
            this._popupPresenter.setViewState(MoviePresenterViewState.RESTART_NEW_COMMENT);
          })
          .catch(() => {
            this._popupPresenter.setViewState(MoviePresenterViewState.ABORTING);
          });

        break;
      case UserAction.DELETE_COMMENT:
        if (!isOnline()) {
          toast('You can\'t delete comment offline');
        }
        this._api.deleteDataComment(updateDataComment, updateDataFilm.id)
          .then(() => {
            this._moviesModel.updateDataFilms(updateDataFilm, updateType);
            this._commentsModel.updateDataComments(updateDataComment, updateType);
          })
          .catch(() => this._popupPresenter.setViewState(MoviePresenterViewState.DELETE_COMMENT));
        break;
    }
  }

  _onMoviesModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        removeComponent(this._loadingComponent);
        this._renderBoardFilms();
        break;
      case UpdateType.PATCH:
        this._sendDataFilmPopup(data);
        this._replaceCurrentCardsFilm(data);
        break;
      case UpdateType.MINOR:
        this._sendDataFilmPopup(data);
        this._clearBoardFilms();
        this._renderBoardFilms();
        break;
      case UpdateType.MAJOR:
        this._clearBoardFilms({renderedFilmCount: true, resetSortType: true});
        this._renderBoardFilms();
        break;
      case UpdateType.ADDITIONAL:
        this._clearBoardFilms({renderedFilmCount: true, resetSortType: true});
        this._statisticsComponent = new StatisticsView(this._getDataFilms(), this._filterPresenter.getCountCurrentFilter(FilterType.HISTORY));
        render(this._listFilmsContainer, this._statisticsComponent);
        break;
    }
  }

  _onCommentsModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._popupPresenter.renderComments(updateType);
        this._renderMostCommentedFilms();
        break;
    }
  }
}
