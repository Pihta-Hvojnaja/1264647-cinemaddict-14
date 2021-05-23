
import { api, FilterType, UserAction, UpdateType } from '../const.js';

import { render, removeComponent, replaceComponent, RenderPosition } from '../utils/render.js';
import { removeItemFromItems } from '../utils/remove-item.js';
import { updateDataWatchlist, updateDataWatched, updateDataFavorite } from '../utils/button-controls.js';

import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';
import NewCommentView from '../view/new-comment.js';


export default class PopupPresenter {

  constructor(popupContainer) {
    this._popupContainer = popupContainer;

    this._popupComponent = null;
    this._commentsComponent = null;
    this._newCommentComponent = null;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCtrlEnterKeyDown = this._onCtrlEnterKeyDown.bind(this);
    this._onWatchlistChange = this._onWatchlistChange.bind(this);
    this._onWatchedChange = this._onWatchedChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onClickDeleteComment = this._onClickDeleteComment.bind(this);
  }

  init(dataFilm, commentsModel, changeData, filterType, updateType) {
    this._dataFilm = dataFilm;
    this._commentsModel = commentsModel;
    this._changeData = changeData;
    this._currentFilterType = filterType;
    this._dataComments = null;

    let prevScrollTopPopup = null;
    let prevScrollLeftPopup = null;

    if (this._popupComponent) {
      prevScrollTopPopup = this._popupComponent.getElement().scrollTop;
      prevScrollLeftPopup = this._popupComponent.getElement().scrollLeft;
      this._closePopup();
    }

    this._renderPopup();

    if (updateType === UpdateType.MINOR) {
      this._popupComponent.getElement().scrollTop = prevScrollTopPopup;
      this._popupComponent.getElement().scrollLeft = prevScrollLeftPopup;
    }
  }

  getPopupComponent() {
    return this._popupComponent;
  }

  setDataFilm(updatedFilm) {
    this._dataFilm = updatedFilm;
  }

  _replaceComments() {
    const prevCommentsComponent = this._commentsComponent;
    this._commentsComponent = new CommentsView(this._dataComments);
    this._commentsComponent.setClickDeleteHandler(this._onClickDeleteComment);

    replaceComponent(this._commentsComponent, prevCommentsComponent);
    removeComponent(prevCommentsComponent);
  }

  renderComments(updateType) {
    if (updateType === UpdateType.MINOR) {
      this._dataComments = this._commentsModel.getDataComments();
      this._replaceComments(this._dataComments);
      return;
    }

    api.getDataComments(this._dataFilm.id)
      .then((dataComments) => {
        if (this._commentsComponent === null) {
          this._setDataComments(dataComments);
          this._commentsComponent = new CommentsView(this._dataComments);
          this._commentsComponent.setClickDeleteHandler(this._onClickDeleteComment);
          render(
            this._popupComponent.getElement().querySelector('.film-details__comments-wrap'),
            this._commentsComponent,
            RenderPosition.AFTERBEGIN,
          );

          return;
        }
        this._setDataComments(dataComments);
        this._replaceComments(dataComments);
      });
  }

  replaceNewComment() {
    const prevNewCommentComponent = this._newCommentComponent;
    this._newCommentComponent = new NewCommentView();
    replaceComponent(this._newCommentComponent, prevNewCommentComponent);
    removeComponent(prevNewCommentComponent);
  }

  _getUpdateType(filterTypeButton) {
    return this._currentFilterType === filterTypeButton ?
      UpdateType.MINOR : UpdateType.PATCH;
  }

  _setDataComments(dataComments) {
    this._commentsModel.setDataComments(dataComments);
    this._dataComments = this._commentsModel.getDataComments();
  }

  _renderPopup() {
    this._newCommentComponent = new NewCommentView();
    this._popupComponent = new PopupView(this._dataFilm);

    this._popupContainer.classList.add('hide-overflow');
    this._popupComponent.setWatchlistChangeHandler(this._onWatchlistChange);
    this._popupComponent.setWatchedChangeHandler(this._onWatchedChange);
    this._popupComponent.setFavoriteChangeHandler(this._onFavoriteChange);
    this._popupComponent.setCloseClickHandler(this._onCloseButtonClick);

    document.addEventListener('keydown', this._onEscKeyDown);
    document.addEventListener('keydown', this._onCtrlEnterKeyDown);

    render(this._popupContainer, this._popupComponent);
    this.renderComments();
    render(this._popupComponent.getElement().querySelector('.film-details__comments-wrap'),
      this._newCommentComponent);
  }

  _closePopup() {
    this._popupContainer.classList.remove('hide-overflow');
    removeComponent(this._newCommentComponent);
    removeComponent(this._commentsComponent);
    removeComponent(this._popupComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
    document.removeEventListener('keydown', this._onCtrlEnterKeyDown);
    this._popupComponent = null;
    this._commentsComponent = null;
  }

  _onCloseButtonClick() {
    this._closePopup();
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._closePopup();
    }
  }

  _onCtrlEnterKeyDown(evt) {
    if (evt.ctrlKey && evt.key === 'enter' || evt.key === 'Enter') {
      this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        this._dataFilm.id,
        this._newCommentComponent.getData(),
      );
      this.replaceNewComment();
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
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      updatedFilm,
      idCommentToDelete,
    );
  }
}
