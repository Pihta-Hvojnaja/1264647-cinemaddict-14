import { render, removeComponent, replaceComponent, RenderPosition } from '../utils/render.js';
import { removeItemFromItems } from '../utils/update-items.js';
import { updateDataWatchlist, updateDataWatched, updateDataFavorite } from '../utils/button-controls.js';

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
    this._onClickDeleteComment = this._onClickDeleteComment.bind(this);
  }

  init(dataFilm, dataComments, changeData, changeComments) {

    this._dataFilm = dataFilm;
    this._dataComments = dataComments.slice();
    this._changeData = changeData;
    this._changeComments = changeComments;

    const filmComments = this._getCommentsCurrentFilm(this._dataFilm);

    if (this._popupComponent) {
      this._closePopup();
    }

    this._commentsComponent = new CommentsView(filmComments);
    this._popupComponent = new PopupView(this._dataFilm);

    this._popupComponent.setWatchlistChangeHandler(this._onWatchlistChange);
    this._popupComponent.setWatchedChangeHandler(this._onWatchedChange);
    this._popupComponent.setFavoriteChangeHandler(this._onFavoriteChange);
    this._commentsComponent.setClickDeleteHandler(this._onClickDeleteComment);
    this._popupComponent.setCloseClickHandler(this._onCloseButtonClick);
    document.addEventListener('keydown', this._onEscKeyDown);

    this._renderPopup();
  }

  /**
   * Функция отбирает комментарии для выбранного фильма из общего массива комментариев
   * @param {Array} data - массив id комментариев из dataFilms
   * @returns {Array} - возвращает массив комментариев выбранного фильма
   */
  _getCommentsCurrentFilm(dataFilm) {
    const { comments } = dataFilm;
    return comments.map((idComment) => this._dataComments.find((dataComment) => dataComment.id === idComment));
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

  _replaceComments(dataFilm) {
    const prevCommentsComponent = this._commentsComponent;
    const filmComments = this._getCommentsCurrentFilm(dataFilm);

    this._commentsComponent = new CommentsView(filmComments);

    this._commentsComponent.setClickDeleteHandler(this._onClickDeleteComment);
    replaceComponent(this._commentsComponent, prevCommentsComponent);
    removeComponent(prevCommentsComponent);
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

  setDataFilm(updatedFilm) {
    this._dataFilm = updatedFilm;
  }

  _onWatchlistChange() {
    this._changeData(updateDataWatchlist(this._dataFilm));
  }

  _onWatchedChange() {
    this._changeData(updateDataWatched(this._dataFilm));
  }

  _onFavoriteChange() {
    this._changeData(updateDataFavorite(this._dataFilm));
  }

  _onClickDeleteComment() {
    const idCommentToDelete = this._commentsComponent.getIdCommentToDelete();
    const updatedFilm = { ...this._dataFilm };

    updatedFilm.comments = removeItemFromItems(this._dataFilm.comments, idCommentToDelete);

    this._changeData(updatedFilm);
    this._changeComments(idCommentToDelete);
    this._replaceComments(updatedFilm);
  }
}
