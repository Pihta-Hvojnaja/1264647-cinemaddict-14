
import { render, replaceComponent, removeComponent } from '../utils/render.js';
import { updateDataWatchlist, updateDataWatched, updateDataFavorite } from '../utils/button-controls.js';

import CardFilmView from '../view/card-film.js';

import { FilterType,  UserAction, UpdateType} from '../const.js';


export default class MoviePresenter {
  constructor(filmContainer, changeData, filterType) {
    this._filmContainer = filmContainer;
    this._idParentSection = this._filmContainer.parentElement.id;

    this._changeData = changeData;

    this._currentFilterType = filterType;

    this._replacePopup = null;
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

  replacePopup(callback) {
    this._replacePopup = callback;
  }

  _getUpdateType(filterTypeButton) {
    return this._currentFilterType === filterTypeButton ?
      UpdateType.MINOR : UpdateType.PATCH;
  }

  _onWatchlistClick() {
    const updateData = updateDataWatchlist(this._dataFilm);

    this._changeData(
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.WATCHLIST),
      updateData,
    );

    this._replacePopup(updateData);
  }

  _onWatchedClick() {
    const updateData = updateDataWatched(this._dataFilm);

    this._changeData(
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.HISTORY),
      updateData,
    );

    this._replacePopup(updateData);
  }

  _onFavoriteClick() {
    const updateData = updateDataFavorite(this._dataFilm);

    this._changeData(
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.FAVORITES),
      updateData,
    );

    this._replacePopup(updateData);
  }
}

