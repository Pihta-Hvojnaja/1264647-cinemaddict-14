import dayjs from 'dayjs';
import { generateDataComments } from '../mock/data-comments.js';

const dataComments = generateDataComments();


/*  Функция синхронизирует данные о фильмах с данными комментариев
   ========================================================================== */

const getFilmComments = (idComments, dataComments) => {
  const currentComments = [];

  idComments.forEach((idComment) => {
    currentComments.push(dataComments.find((dataComment) => dataComment.id === idComment));
  });

  return currentComments;
};


/*  Функция создает комментарии
   ========================================================================== */

const createComments = (filmComments) => {

  return filmComments.reduce((accumulator, filmComment) => {
    const { comment, emotion, author, date } = filmComment;
    accumulator += ` <li class="film-details__comment">
                        <span class="film-details__comment-emoji">
                          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
                        </span>
                        <div>
                          <p class="film-details__comment-text">${comment}</p>
                          <p class="film-details__comment-info">
                            <span class="film-details__comment-author">${author}</span>
                            <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD hh:mm')}</span>
                            <button class="film-details__comment-delete">Delete</button>
                          </p>
                        </div>
                      </li>`;
    return accumulator;

  }, '');
};


/*  Функция создает список комментариев
   ========================================================================== */

export const createListComments = (idComments) => {

  const filmComments = getFilmComments(idComments, dataComments);

  return `<ul class="film-details__comments-list">
            ${createComments(filmComments)}
          </ul>`;
};
