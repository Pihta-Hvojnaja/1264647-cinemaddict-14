import dayjs from 'dayjs';
import { generateDataComments } from '../mock/data-comments.js';
import AbstractView from './abstract.js';


/*  Генерируем данные для комментариев
   ========================================================================== */

const dataComments = generateDataComments();


/*  Функция синхронизирует данные о фильмах с данными комментариев
   ========================================================================== */

const getFilmComments = (idsComments, dataComments) => {
  return idsComments.map((idComment) => dataComments.find((dataComment) => dataComment.id === idComment));
};


/*  Функция возвращает комментарии
   ========================================================================== */

const createComments = (filmComments) => {

  return filmComments.reduce((accumulator, filmComment) => {
    const { id, comment, emotion, author, date } = filmComment;

    accumulator += ` <li id="${id}" class="film-details__comment">
                        <span class="film-details__comment-emoji">
                          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
                        </span>
                        <div>
                          <p class="film-details__comment-text">${comment}</p>
                          <p class="film-details__comment-info">
                            <span class="film-details__comment-author">${author}</span>
                            <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD hh:mm')}</span>
                            <button class="film-details__comment-delete" type="button">Delete</button>
                          </p>
                        </div>
                      </li>`;
    return accumulator;

  }, '');
};


/*  Функция возвращает список комментариев
   ========================================================================== */

const createListCommentsTemplate = (idsComments) => {

  const filmComments = getFilmComments(idsComments, dataComments);

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
  constructor(idsComments) {
    super();
    this._idsComments = idsComments;
    this._clickHandler = this._clickHandler.bind(this);
    this._evt = null;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._evt = evt;
    this._callback.click();
  }

  getTemplate() {
    return createListCommentsTemplate(this._idsComments);
  }

  getEvt() {
    return this._evt;
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._clickHandler);
  }
}
