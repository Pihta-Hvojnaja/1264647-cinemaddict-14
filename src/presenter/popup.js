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
  }

  init(dataFilm) {
    const { filmInfo, comments } = dataFilm;

    if (this._popupComponent) {
      this._closePopup();
    }

    this._popupComponent = new PopupView(filmInfo);
    this._commentsComponent = new CommentsView(comments);

    this._renderPopup();

    /** Обработчик кнопки удаления комментариев */
    createCommentRemover(this._commentsComponent);

    this._popupComponent.setClickHandler(this._onCloseButtonClick);
    document.addEventListener('keydown', this._onEscKeyDown);
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
}
