import { render, removeComponent, replaceComponent, RenderPosition } from '../utils/render.js';
import { removeItemFromItems } from '../utils/remove-item.js';
import { updateDataWatchlist, updateDataWatched, updateDataFavorite } from '../utils/button-controls.js';

import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';
import NewCommentView from '../view/new-comment.js';

import { FilterType, UserAction, UpdateType } from '../const.js';


export default class PopupPresenter {

  constructor(popupContainer) {
    this._popupContainer = popupContainer;

    this._popupComponent = null;
    this._commentsComponent = null;
    this._newCommentComponent = null;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onWatchlistChange = this._onWatchlistChange.bind(this);
    this._onWatchedChange = this._onWatchedChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onClickDeleteComment = this._onClickDeleteComment.bind(this);
  }

  init(dataFilm, dataComments, changeData, changeComments, filterType) {
    this._dataFilm = dataFilm;
    this._dataComments = dataComments.slice();

    this._changeData = changeData;
    this._changeComments = changeComments;

    this._currentFilterType = filterType;

    const filmComments = this._getCommentsCurrentFilm(this._dataFilm);

    if (this._popupComponent) {
      this._closePopup();
    }

    this._commentsComponent = new CommentsView(filmComments);
    this._newCommentComponent = new NewCommentView();
    this._popupComponent = new PopupView(this._dataFilm);

    this._renderPopup();
  }

  getPopupComponent() {
    return this._popupComponent;
  }

  setDataFilm(updatedFilm) {
    this._dataFilm = updatedFilm;
  }

  replaceComments() {
    const prevCommentsComponent = this._commentsComponent;
    const filmComments = this._getCommentsCurrentFilm(this._dataFilm);

    this._commentsComponent = new CommentsView(filmComments);

    this._commentsComponent.setClickDeleteHandler(this._onClickDeleteComment);

    replaceComponent(this._commentsComponent, prevCommentsComponent);
    removeComponent(prevCommentsComponent);
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

  _getUpdateType(filterTypeButton) {
    return this._currentFilterType === filterTypeButton ?
      UpdateType.MINOR : UpdateType.PATCH;
  }

  _renderPopup() {
    this._popupContainer.classList.add('hide-overflow');

    this._popupComponent.setWatchlistChangeHandler(this._onWatchlistChange);
    this._popupComponent.setWatchedChangeHandler(this._onWatchedChange);
    this._popupComponent.setFavoriteChangeHandler(this._onFavoriteChange);
    this._commentsComponent.setClickDeleteHandler(this._onClickDeleteComment);
    this._popupComponent.setCloseClickHandler(this._onCloseButtonClick);
    document.addEventListener('keydown', this._onEscKeyDown);

    render(this._popupContainer, this._popupComponent);
    render(
      this._popupComponent.getElement().querySelector('.film-details__comments-wrap'),
      this._commentsComponent,
      RenderPosition.AFTERBEGIN,
    );
    render(this._popupComponent.getElement().querySelector('.film-details__comments-wrap'),
      this._newCommentComponent);
  }

  _closePopup() {
    this._popupContainer.classList.remove('hide-overflow');
    removeComponent(this._newCommentComponent);
    removeComponent(this._commentsComponent);
    removeComponent(this._popupComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._popupComponent = null;
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
    this._changeData(
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.WATCHLIST),
      updateDataWatchlist(this._dataFilm),
    );
  }

  _onWatchedChange() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.HISTORY),
      updateDataWatched(this._dataFilm),
    );
  }

  _onFavoriteChange() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._getUpdateType(FilterType.FAVORITES),
      updateDataFavorite(this._dataFilm),
    );
  }

  _onClickDeleteComment() {
    const updatedFilm = { ...this._dataFilm };

    const idCommentToDelete = this._commentsComponent.getIdCommentToDelete();

    updatedFilm.comments = removeItemFromItems(this._dataFilm.comments, idCommentToDelete);

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      updatedFilm,
    );

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MAJOR,
      idCommentToDelete,
    );
  }
}
