
import { generateDataFilm } from './mock/data-film.js';

import { createProfileTemplate } from './view/profile.js';
import { createSiteMenuTemplate } from './view/site-menu.js';
import { createSortTemplate } from './view/sort.js';

import {
  createSectionFilmsTemplate,
  createFilmsListTemplate,
  createListTopRatedTemplate,
  createListMostCommentedTemplate
} from './view/sections-films.js';

import { createButtonShowMoreTemplate } from './view/button-show-more.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createPopupTemplate } from './view/popup.js';


/*  Общие переменные
   ========================================================================== */
const FILM_COUNT = 20;
const bodyElement = document.querySelector('body');
const headerSiteElement = bodyElement.querySelector('.header');
const mainSiteElement = bodyElement.querySelector('.main');


/*  Генерируем данные
   ========================================================================== */

const dataFilms = new Array(FILM_COUNT).fill().map(generateDataFilm);


/*  Ф-ция отрисовки шаблонов
   ========================================================================== */

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};


/*  Отрисовывает профиль
   ========================================================================== */

render(headerSiteElement, createProfileTemplate());


/*  Отрисовывает меню
   ========================================================================== */

render(mainSiteElement, createSiteMenuTemplate());


/*  Отрисовывает сортировку
   ========================================================================== */

render(mainSiteElement, createSortTemplate());


/*  Отрисовывает секции
   ========================================================================== */

//Отрисовывает секцию films
render(mainSiteElement, createSectionFilmsTemplate());
const filmsSectionElement = mainSiteElement.querySelector('.films');

//Отрисовывает секции внутри films
render(filmsSectionElement, createFilmsListTemplate());
render(filmsSectionElement, createListTopRatedTemplate());
render(filmsSectionElement, createListMostCommentedTemplate());

//Находит секции
const filmsListElement = filmsSectionElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');
const filmsTopRatedElement = filmsSectionElement.querySelector('.films-list--extra:nth-child(2) .films-list__container');
const filmsMostCommentedElement = filmsSectionElement.querySelector('.films-list--extra:nth-child(3) .films-list__container');


/*  Отрисовывает кнопку "показать еще"
   ========================================================================== */

render(filmsListElement, createButtonShowMoreTemplate());


/*  Отрисовывает 5 карточек в списке
   ========================================================================== */

for (let i = 0; i < 5; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(dataFilms[i]));
}


/*  Отрисовывает карточки в блоках «Top rated movies» и «Most commented», по две карточки в каждом блоке
   ========================================================================== */

// Ф-ция сортировки данных
const getTopRated = (items, property) => {
  const copyItems = items.slice();

  return property ?
    copyItems.sort((firstElement, secondElement) => secondElement.filmInfo.totalRating - firstElement.filmInfo.totalRating) :
    copyItems.sort((firstElement, secondElement) => secondElement.comments.length - firstElement.comments.length);
};

// Данные фильмов «Top rated movies» и «Most commented»
const dataTopRatedFilms = getTopRated(dataFilms, 'rating');
const dataMostCommentedFilms = getTopRated(dataFilms);

for (let i = 0; i < 2; i++) {
  render(filmsTopRatedElement, createFilmCardTemplate(dataTopRatedFilms[i]));
}

for (let i = 0; i < 2; i++) {
  render(filmsMostCommentedElement, createFilmCardTemplate(dataMostCommentedFilms[i]));
}


/*  Обработчик открытия попапа
   ========================================================================== */

const isClickCardFilm = (evt) => {
  const currentElement = evt.target.className;
  return currentElement === 'film-card__poster' ||
          currentElement === 'film-card__title' ||
            currentElement === 'film-card__comments';
};

filmsSectionElement.addEventListener('click', (evt) => {

  if (bodyElement.querySelector('.film-details')) {
    bodyElement.querySelector('.film-details').remove();
  }

  if (isClickCardFilm(evt)) {

    const parentId = evt.target.parentElement.id;

    //Отрисовывает попап
    //**если «Top rated movies»
    if (parentId === 'top-rated') {
      render(bodyElement, createPopupTemplate(dataTopRatedFilms[evt.target.id]));

    //**если «Most commented»
    } else if (parentId === 'most-commented') {
      render(bodyElement, createPopupTemplate(dataMostCommentedFilms[evt.target.id]));

    //** если в списке
    } else {
      render(bodyElement, createPopupTemplate(dataFilms[parentId]));
    }

    //Находит попап и кнопку закрытия попапа
    const popupElement = bodyElement.querySelector('.film-details');
    const filmDetailsCloseBtnElement = popupElement.querySelector('.film-details__close-btn');

    filmDetailsCloseBtnElement.addEventListener('click', () => {
      popupElement.remove();
    },
    { once: true });
  }
});
