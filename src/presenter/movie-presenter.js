
import { render, replaceComponent, removeComponent } from '../utils/render.js';
import { updateDataWatchlist, updateDataWatched, updateDataFavorite } from '../utils/button-controls.js';

import CardFilmView from '../view/card-film.js';

import { FilterType,  UserAction, UpdateType} from '../const.js';


export default class MoviePresenter {
  constructor(filmContainer, changeData, filterType) {
    this._filmContainer = filmContainer;
    this._idParentSection = this._filmContainer.parentElement.id;

    this._changeData = changeData;

    this._filterType = filterType;

    this._cardFilmComponent = null;

    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  init(dataFilm) {
    this._dataFilm = dataFilm;

    const prevCardFilmComponent = this._cardFilmComponent;

    this._cardFilmComponent = new CardFilmView(this._dataFilm);

    this._cardFilmComponent.setWatchlistClickHandler(this._onWatchlistClick);
    this._cardFilmComponent.setWatchedClickHandler(this._onWatchedClick);
    this._cardFilmComponent.setFavoriteClickHandler(this._onFavoriteClick);

    if (prevCardFilmComponent === null) {
      render(this._filmContainer, this._cardFilmComponent);
      return;
    }

    replaceComponent(this._cardFilmComponent, prevCardFilmComponent);
    removeComponent(prevCardFilmComponent);
  }

  getId() {
    return this._dataFilm.id;
  }

  getIdParentSection() {
    return this._idParentSection;
  }

  destroy() {
    removeComponent(this._cardFilmComponent);
  }

  _onWatchlistClick() {
    const updateType = this._filterType === FilterType.WATCHLIST ?
      UpdateType.MINOR : UpdateType.PATCH;

    this._changeData(
      UserAction.UPDATE_FILM,
      updateType,
      updateDataWatchlist(this._dataFilm),
    );
  }

  _onWatchedClick() {
    const updateType = this._filterType === FilterType.HISTORY ?
      UpdateType.MINOR : UpdateType.PATCH;

    this._changeData(
      UserAction.UPDATE_FILM,
      updateType,
      updateDataWatched(this._dataFilm),
    );
  }

  _onFavoriteClick() {
    const updateType = this._filterType === FilterType.FAVORITES ?
      UpdateType.MINOR : UpdateType.PATCH;

    this._changeData(
      UserAction.UPDATE_FILM,
      updateType,
      updateDataFavorite(this._dataFilm),
    );
  }
}

