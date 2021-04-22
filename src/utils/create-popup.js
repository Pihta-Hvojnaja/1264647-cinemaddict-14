
import { render, RenderPosition } from './render.js';

/**
 * @param {Object} parentElement - элемент, внутри которого отрисовывается Popup
 * @param {Object} popupComponent - компонент Popup
 * @param {Object} commentsComponent - компонент Comments (отрисовываются внутри попапа)
 */

export const createPopup = (parentElement, popupComponent, commentsComponent) => {

  // Удаляет вертикальный скролл родительского элемента
  parentElement.classList.add('hide-overflow');

  // Отрисовывает попап
  render(parentElement, popupComponent);

  // Отрисовывает комментарии
  render(
    popupComponent.getElement().querySelector('.film-details__comments-wrap'),
    commentsComponent,
    RenderPosition.AFTERBEGIN,
  );
};
