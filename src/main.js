
import { generateDataFilm } from './mock/data-film.js';
import { generateFilter } from './mock/filter.js';

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
import { createFooterStatisticsTemplate } from './view/footer-statistics.js';


/*  Общие переменные
   ========================================================================== */

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;

const bodyElement = document.querySelector('body');
const headerSiteElement = bodyElement.querySelector('.header');
const mainSiteElement = bodyElement.querySelector('.main');
const footerStatisticsElement = bodyElement.querySelector('.footer__statistics');


/*  Функция отрисовки шаблонов
   ========================================================================== */

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};


/*  Генерируем данные
   ========================================================================== */

const dataFilms = new Array(FILM_COUNT).fill().map(generateDataFilm);
const filters = generateFilter(dataFilms);


/*  Отрисовываем профиль
   ========================================================================== */

render(headerSiteElement, createProfileTemplate(filters));


/*  Отрисовываем меню
   ========================================================================== */

render(mainSiteElement, createSiteMenuTemplate(filters));


/*  Отрисовываем сортировку
   ========================================================================== */

render(mainSiteElement, createSortTemplate());


/*  Отрисовываем секции
   ========================================================================== */

// Отрисовываем секцию films
render(mainSiteElement, createSectionFilmsTemplate());
const filmsSectionElement = mainSiteElement.querySelector('.films');

// Отрисовываем секции внутри films
render(filmsSectionElement, createFilmsListTemplate());
render(filmsSectionElement, createListTopRatedTemplate());
render(filmsSectionElement, createListMostCommentedTemplate());

// Находим секции
const filmsListElement = filmsSectionElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');
const filmsTopRatedElement = filmsSectionElement.querySelector('.films-list--extra:nth-child(2) .films-list__container');
const filmsMostCommentedElement = filmsSectionElement.querySelector('.films-list--extra:nth-child(3) .films-list__container');


/*  Отрисовываем первые карточки
   ========================================================================== */

for (let i = 0; i < Math.min(dataFilms.length, FILM_COUNT_PER_STEP); i++) {
  render(filmsListContainerElement, createFilmCardTemplate(dataFilms[i]));
}


/*  Отрисовываем кнопку show more
   ========================================================================== */

if (dataFilms.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmsListElement, createButtonShowMoreTemplate());

  // Обработчик кнопки show more
  const buttonShowMoreElement = filmsListElement.querySelector('.films-list__show-more');

  buttonShowMoreElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    dataFilms
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((dataFilm) => render(filmsListContainerElement, createFilmCardTemplate(dataFilm)));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= dataFilms.length) {
      buttonShowMoreElement.remove();
    }
  });
}


/*  Отрисовываем карточки в блоках «Top rated movies» и «Most commented»,
 *  по две карточки в каждом блоке
   ========================================================================== */

// Функции сортировки данных
const getTopRated = (items) => items.slice()
  .sort((firstElement, secondElement) => secondElement.filmInfo.totalRating - firstElement.filmInfo.totalRating);

const getMostCommented = (items) => items.slice()
  .sort((firstElement, secondElement) => secondElement.comments.length - firstElement.comments.length);

// Сортируем данные для фильмов «Top rated movies» и «Most commented»
const dataTopRatedFilms = getTopRated(dataFilms);
const dataMostCommentedFilms = getMostCommented(dataFilms);

// Отрисовываем карточки в блоке «Top rated movies»,
for (let i = 0; i < 2; i++) {
  render(filmsTopRatedElement, createFilmCardTemplate(dataTopRatedFilms[i]));
}

// Отрисовываем карточки в блоке «Most commented»
for (let i = 0; i < 2; i++) {
  render(filmsMostCommentedElement, createFilmCardTemplate(dataMostCommentedFilms[i]));
}


/*  Отрисовываем статистику в footer
   ========================================================================== */

render(footerStatisticsElement, createFooterStatisticsTemplate(dataFilms));


/*  Обработчик открытия попапа
   ========================================================================== */

const isClickCardFilm = (evt) => {
  const currentElement = evt.target.className;
  return currentElement === 'film-card__poster' ||
          currentElement === 'film-card__title' ||
            currentElement === 'film-card__comments';
};

filmsSectionElement.addEventListener('click', (evt) => {
  evt.preventDefault();

  if (bodyElement.querySelector('.film-details')) {
    bodyElement.querySelector('.film-details').remove();
  }

  if (isClickCardFilm(evt)) {

    //Отрисовывает попап
    render(bodyElement, createPopupTemplate(dataFilms[evt.target.parentElement.id]));

    //Находит попап и кнопку закрытия попапа
    const popupElement = bodyElement.querySelector('.film-details');
    const filmDetailsCloseBtnElement = popupElement.querySelector('.film-details__close-btn');

    filmDetailsCloseBtnElement.addEventListener('click', () => {
      popupElement.remove();
    },
    { once: true });
  }
});
