
import { render, replaceComponent, removeComponent } from '../utils/render.js';

import CardFilmView from '../view/card-film.js';


export default class Movie {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

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

  destroy() {
    removeComponent(this._cardFilmComponent);
  }

  _onWatchlistClick() {
    const updatedFilm = { ...this._dataFilm };
    updatedFilm.userDetails.watchlist = !this._dataFilm.userDetails.watchlist;

    this._changeData(updatedFilm);
  }

  _onWatchedClick() {
    const updatedFilm = { ...this._dataFilm };
    updatedFilm.userDetails.alreadyWatched = !this._dataFilm.userDetails.alreadyWatched;

    this._changeData(updatedFilm);
  }

  _onFavoriteClick() {
    const updatedFilm = { ...this._dataFilm };
    updatedFilm.userDetails.favorite = !this._dataFilm.userDetails.favorite;

    this._changeData(updatedFilm);
  }
}

