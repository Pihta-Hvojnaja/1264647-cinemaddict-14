
import { render, removeComponent } from './utils/render.js';
import { getTopRated, getMostCommented } from './utils/sort-data.js';
import { isClickCardFilm } from './utils/popup.js';
import { createPopup } from './utils/create-popup.js';
import { createCommentRemover } from './utils/comment-remover.js';
import { createPopupCloser } from './utils/popup-closer.js';

import { generateDataFilm } from './mock/data-film.js';
import { generateFilter } from './mock/filter.js';

import ProfileView from './view/profile.js';
import SiteFilterView from './view/site-filter.js';
import SortView from './view/sort.js';

import NoFilmsView from './view/no-films.js';
import SectionFilmsView from './view/section-films.js';

import FilmCardView from './view/film-card.js';
import PopupView from './view/popup.js';
import CommentsView from './view/comments.js';
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

render(headerSiteElement, new ProfileView(filters));


/*  Отрисовываем меню
   ========================================================================== */

render(mainSiteElement, new SiteFilterView(filters));


/*  Отрисовываем сортировку
   ========================================================================== */

render(mainSiteElement, new SortView());


/*  Отрисовываем секции и карточки
   ========================================================================== */

if (dataFilms.length === 0) {
  render(mainSiteElement, new NoFilmsView());

} else {
  const sectionFilmsComponent = new SectionFilmsView();

  /**
   *  Отрисовываем секцию films
   */

  render(mainSiteElement, sectionFilmsComponent);

  // Находим внутренние секции
  const allFilmsElement = sectionFilmsComponent.getElement().querySelector('#all-films');
  const allFilmsBoxElement = allFilmsElement.querySelector('.films-list__container');
  const topFilmsRatedElement = sectionFilmsComponent.getElement().querySelector('#top-rated .films-list__container');
  const mostCommentedFilmsElement = sectionFilmsComponent.getElement().querySelector('#most-commented .films-list__container');

  /**
   *  Отрисовываем первые карточки
   */

  for (let i = 0; i < Math.min(dataFilms.length, FILM_COUNT_PER_STEP); i++) {
    render(allFilmsBoxElement, new FilmCardView(dataFilms[i]));
  }

  /**
   *  Отрисовываем кнопку show more
   */

  if (dataFilms.length > FILM_COUNT_PER_STEP) {

    let renderedFilmCount = FILM_COUNT_PER_STEP;
    const buttonShowMoreElement = new ButtonShowMoreView();

    render(allFilmsElement, buttonShowMoreElement);

    // Обработчик кнопки show more
    buttonShowMoreElement.setClickHandler(() => {
      dataFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((dataFilm) => render(allFilmsBoxElement, new FilmCardView(dataFilm)));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= dataFilms.length) {
        removeComponent(buttonShowMoreElement);
      }
    });
  }

  /**
   *  Отрисовываем карточки в блоках «Top rated movies» и «Most commented»,
   *  по две карточки в каждом блоке
   */

  // Сортируем данные для фильмов «Top rated movies» и «Most commented»
  const dataTopRatedFilms = getTopRated(dataFilms);
  const dataMostCommentedFilms = getMostCommented(dataFilms);

  // Отрисовываем карточки в блоке «Top rated movies»,
  for (let i = 0; i < 2; i++) {
    render(topFilmsRatedElement, new FilmCardView(dataTopRatedFilms[i]));
  }

  // Отрисовываем карточки в блоке «Most commented»
  for (let i = 0; i < 2; i++) {
    render(mostCommentedFilmsElement, new FilmCardView(dataMostCommentedFilms[i]));
  }

  /**
   *  Обработчик открытия попапа
   */

  let popupComponent = null;

  sectionFilmsComponent.setClickHandler(() => {

    if (popupComponent) {
      removeComponent(popupComponent);
    }

    if (isClickCardFilm(sectionFilmsComponent.getEvt())) {

      // Получаем данные выбранного фильма
      const dataFilm = dataFilms[sectionFilmsComponent.getEvt().target.parentElement.id];
      const { filmInfo, comments } = dataFilm;

      // Отрисовывает попап
      popupComponent = new PopupView(filmInfo);
      const commentsComponent = new CommentsView(comments);
      createPopup(bodyElement, popupComponent, commentsComponent);

      // Обработчик кнопки удаления комментариев
      createCommentRemover(commentsComponent);

      // Обработчики закрытия попапа
      createPopupCloser(bodyElement, popupComponent);
    }
  });
}


/*  Отрисовываем статистику в footer
   ========================================================================== */

render(footerStatisticsElement, new FooterStatisticsView(dataFilms));
