
import { render, RenderPosition, createClosePopup } from './util.js';

import { generateDataFilm } from './mock/data-film.js';
import { generateFilter } from './mock/filter.js';

import ProfileView from './view/profile.js';
import SiteFilterView from './view/site-filter.js';
import SortView from './view/sort.js';

import NoFilmsView from './view/no-films.js';
import SectionFilmsView from './view/section-films.js';

import FilmCardView from './view/film-card.js';
import PopupView from './view/popup.js';
import ButtonShowMoreView from './view/button-show-more.js';
import FooterStatisticsView from './view/footer-statistics.js';


/*  Общие переменные
   ========================================================================== */

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;

const bodyElement = document.querySelector('body');
const headerSiteElement = bodyElement.querySelector('.header');
const mainSiteElement = bodyElement.querySelector('.main');
const footerStatisticsElement = bodyElement.querySelector('.footer__statistics');


/*  Генерируем данные
   ========================================================================== */

const dataFilms = new Array(FILM_COUNT).fill().map(generateDataFilm);
const filters = generateFilter(dataFilms);


/*  Отрисовываем профиль
   ========================================================================== */

render(headerSiteElement, new ProfileView(filters).getElement(), RenderPosition.BEFOREEND);


/*  Отрисовываем меню
   ========================================================================== */

render(mainSiteElement, new SiteFilterView(filters).getElement());


/*  Отрисовываем сортировку
   ========================================================================== */

render(mainSiteElement, new SortView().getElement());


/*  Отрисовываем секции и карточки
   ========================================================================== */

if (dataFilms.length === 0) {
  render(mainSiteElement, new NoFilmsView().getElement());

} else {
  const sectionFilmsElement = new SectionFilmsView().getElement();

  /**
   *  Отрисовываем секцию films
   */

  render(mainSiteElement, sectionFilmsElement);

  // Находим внутренние секции
  const allFilmsElement = sectionFilmsElement.querySelector('#all-films');
  const allFilmsBoxElement = allFilmsElement.querySelector('.films-list__container');
  const topFilmsRatedElement = sectionFilmsElement.querySelector('#top-rated .films-list__container');
  const mostCommentedFilmsElement = sectionFilmsElement.querySelector('#most-commented .films-list__container');

  /**
   *  Отрисовываем первые карточки
   */

  for (let i = 0; i < Math.min(dataFilms.length, FILM_COUNT_PER_STEP); i++) {
    render(allFilmsBoxElement, new FilmCardView(dataFilms[i]).getElement());
  }

  /**
   *  Отрисовываем кнопку show more
   */

  if (dataFilms.length > FILM_COUNT_PER_STEP) {

    let renderedFilmCount = FILM_COUNT_PER_STEP;
    const buttonShowMoreElement = new ButtonShowMoreView().getElement();

    render(allFilmsElement, buttonShowMoreElement);

    // Обработчик кнопки show more
    buttonShowMoreElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      dataFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((dataFilm) => render(allFilmsBoxElement, new FilmCardView(dataFilm).getElement()));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= dataFilms.length) {
        buttonShowMoreElement.remove();
      }
    });
  }

  /**
   *  Отрисовываем карточки в блоках «Top rated movies» и «Most commented»,
   *  по две карточки в каждом блоке
   */

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
    render(topFilmsRatedElement, new FilmCardView(dataTopRatedFilms[i]).getElement());
  }

  // Отрисовываем карточки в блоке «Most commented»
  for (let i = 0; i < 2; i++) {
    render(mostCommentedFilmsElement, new FilmCardView(dataMostCommentedFilms[i]).getElement());
  }

  /**
   *  Обработчик открытия попапа
   */

  const isClickCardFilm = (evt) => {
    const currentElement = evt.target.className;
    return currentElement === 'film-card__poster' ||
            currentElement === 'film-card__title' ||
              currentElement === 'film-card__comments';
  };


  let popupElement = null;

  sectionFilmsElement.addEventListener('click', (evt) => {
    evt.preventDefault();

    if (popupElement) {
      popupElement.remove();
    }

    if (isClickCardFilm(evt)) {

      // Создает попап и находит кнопку закрытия попапа
      popupElement = new PopupView(dataFilms[evt.target.parentElement.id]).getElement();
      const popupCloseElement = popupElement.querySelector('.film-details__close-btn');

      // Отрисовывает попап
      render(bodyElement, popupElement);

      // Удаляет вертикальный скролл body
      bodyElement.classList.add('hide-overflow');

      createClosePopup(evt, bodyElement, popupElement, popupCloseElement);
    }
  });
}


/*  Отрисовываем статистику в footer
   ========================================================================== */

render(footerStatisticsElement, new FooterStatisticsView(dataFilms).getElement(), RenderPosition.BEFOREEND);
