
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AbstractView from './abstract.js';

dayjs.extend(relativeTime);

const StatusButton = {
  DELETE: 'Delete',
  DELETING: 'Deleting...',
};

/**
 * Функция возвращает готовые комментарии
 * @param {Array} filmComments - массив комментариев выбранного фильма
 * @returns {string} - возвращает заполненный шаблон комментариев
 */
const createComments = (filmComments) => {

  return filmComments.reduce((accumulator, filmComment) => {
    const { id, comment, emotion, author, date } = filmComment;

    accumulator += `<li id="${id}" class="film-details__comment">
                      <span class="film-details__comment-emoji">
                        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
                      </span>
                      <div>
                        <p class="film-details__comment-text">${comment}</p>
                        <p class="film-details__comment-info">
                          <span class="film-details__comment-author">${author}</span>
                          <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
                          <button class="film-details__comment-delete" type="button">Delete</button>
                        </p>
                      </div>
                    </li>`;
    return accumulator;

  }, '');
};


/**
 * Функция возвращает список комментариев
 * @param {Array} filmComments - массив комментариев выбранного фильма
 * @returns {string} - возвращает заполненный шаблон секции film-details__comments
 */
const createListCommentsTemplate = (filmComments) => {

  return `<section class="film-details__comments">
            <h3 class="film-details__comments-title">
                Comments
              <span class="film-details__comments-count">
                ${filmComments.length}
              </span>
            </h3>
            <ul class="film-details__comments-list">
              ${createComments(filmComments)}
            </ul>
          </section>`;
};


export default class Comments extends AbstractView {
  constructor(filmComments) {
    super();
    this._filmComments = filmComments;
    this._clickDeleteHandler = this._clickDeleteHandler.bind(this);
    this._commentToDeleteElement = null;
    this._buttonDeleteCommentElement = null;
  }

  getTemplate() {
    return createListCommentsTemplate(this._filmComments);
  }

  getIdCommentToDelete() {
    return this._commentToDeleteElement.id;
  }

  setClickDeleteHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector('.film-details__comments-list')
      .addEventListener('click', this._clickDeleteHandler);
  }

  changeStatusButtonDeleteComment(status = StatusButton.DELETE) {
    this._buttonDeleteCommentElement.textContent = status;
    this._buttonDeleteCommentElement.disabled = !this._buttonDeleteCommentElement.disabled;
  }

  _clickDeleteHandler(evt) {
    evt.preventDefault();

    if (evt.target.className === 'film-details__comment-delete') {
      this._commentToDeleteElement = evt.target.closest('.film-details__comment');
      this._buttonDeleteCommentElement = this._commentToDeleteElement.querySelector('.film-details__comment-delete');
      this.changeStatusButtonDeleteComment(StatusButton.DELETING);
      this._callback.click();
    }
  }
}
