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

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};


//Переменные
const bodyElement = document.querySelector('body');
const headerSiteElement = bodyElement.querySelector('.header');
const mainSiteElement = bodyElement.querySelector('.main');


//Отрисовывает профиль
render(headerSiteElement, createProfileTemplate());

//Отрисовывает меню
render(mainSiteElement, createSiteMenuTemplate());

//Отрисовывает сортировку
render(mainSiteElement, createSortTemplate());

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
const filmsTopRatedlement = filmsSectionElement.querySelector('.films-list--extra:nth-child(2) .films-list__container');
const filmsMostCommentedElement = filmsSectionElement.querySelector('.films-list--extra:nth-child(3) .films-list__container');

//Отрисовывает кнопку "показать еще"
render(filmsListElement, createButtonShowMoreTemplate());

//Отрисовывает 5 карточек в списке
for (let i = 0; i < 5; i++) {
  render(filmsListContainerElement, createFilmCardTemplate());
}

//Отрисовывает карточки в в блоках «Top rated movies» и «Most commented», по две карточки в каждом блоке.
for (let i = 0; i < 2; i++) {
  render(filmsTopRatedlement, createFilmCardTemplate());
}

for (let i = 0; i < 2; i++) {
  render(filmsMostCommentedElement, createFilmCardTemplate());
}

filmsSectionElement.addEventListener('click', (evt) => {
  if (evt.target.className === 'film-card__poster') {

    //Отрисовывает попап
    render(bodyElement, createPopupTemplate());

    //Находит попап и кнопку закрытия попапа
    const popupElement = bodyElement.querySelector('.film-details');
    const filmDetailsCloseBtnElement = popupElement.querySelector('.film-details__close-btn');

    filmDetailsCloseBtnElement.addEventListener('click', () => {
      popupElement.remove();
    },
    { once: true });
  }
});
