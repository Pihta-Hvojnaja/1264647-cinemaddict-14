import { render, removeComponent, RenderPosition } from '../utils/render.js';
import { createCommentRemover } from '../utils/comment-remover.js';

import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';


export default class Popup {

  constructor(popupContainer) {
    this._popupContainer = popupContainer;

    this._popupComponent = null;
    this._commentsComponent = null;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onWatchlistChange = this._onWatchlistChange.bind(this);
    this._onWatchedChange = this._onWatchedChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
  }

  init(dataFilm, dataComments, changeData) {

    this._dataFilm = dataFilm;
    this._dataComments = dataComments.slice();
    this._changeData = changeData;

    const { comments } = dataFilm;
    const filmComments = this._getCommentsCurrentFilm(comments);

    if (this._popupComponent) {
      this._closePopup();
    }

    this._commentsComponent = new CommentsView(filmComments);
    this._popupComponent = new PopupView(this._dataFilm);

    this._popupComponent.setWatchlistChangeHandler(this._onWatchlistChange);
    this._popupComponent.setWatchedChangeHandler(this._onWatchedChange);
    this._popupComponent.setFavoriteChangeHandler(this._onFavoriteChange);

    this._renderPopup();

    /** Обработчик кнопки удаления комментариев */
    createCommentRemover(this._commentsComponent);

    this._popupComponent.setCloseClickHandler(this._onCloseButtonClick);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  /**
   * Функция отбирает комментарии для выбранного фильма из общего массива комментариев
   * @param {Array} data - массив id комментариев из dataFilms
   * @returns {Array} - возвращает массив комментариев выбранного фильма
   */
  _getCommentsCurrentFilm(idsComments) {
    return idsComments.map((idComment) => this._dataComments.find((dataComment) => dataComment.id === idComment));
  }

  /** Отрисовывает попап*/
  _renderPopup() {
    this._popupContainer.classList.add('hide-overflow');
    render(this._popupContainer, this._popupComponent);
    render(
      this._popupComponent.getElement().querySelector('.film-details__comments-wrap'),
      this._commentsComponent,
      RenderPosition.AFTERBEGIN,
    );
  }

  _closePopup() {
    this._popupContainer.classList.remove('hide-overflow');
    removeComponent(this._commentsComponent);
    removeComponent(this._popupComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onCloseButtonClick() {
    this._closePopup();
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._closePopup();
    }
  }

  _onWatchlistChange() {
    const updatedFilm = { ...this._dataFilm };
    updatedFilm.userDetails.watchlist = !this._dataFilm.userDetails.watchlist;

    this._changeData(updatedFilm);
  }

  _onWatchedChange() {
    const updatedFilm = { ...this._dataFilm };
    updatedFilm.userDetails.alreadyWatched = !this._dataFilm.userDetails.alreadyWatched;

    this._changeData(updatedFilm);
  }

  _onFavoriteChange() {
    const updatedFilm = { ...this._dataFilm };
    updatedFilm.userDetails.favorite = !this._dataFilm.userDetails.favorite;

    this._changeData(updatedFilm);
  }
}
