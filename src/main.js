
import { render } from './utils/render.js';

import { generateDataFilm } from './mock/data-film.js';
import { generateDataComments } from './mock/data-comments.js';
import { generateFilter } from './mock/filter.js';

import ProfileView from './view/profile.js';
import SiteFilterView from './view/site-filter.js';
import FooterStatisticsView from './view/footer-statistics.js';

import MovieListPresenter from './presenter/movie-list.js';


/*  Общие переменные
   ========================================================================== */

const FILM_COUNT = 20;

const bodyElement = document.querySelector('body');
const headerSiteElement = bodyElement.querySelector('.header');
const mainSiteElement = bodyElement.querySelector('.main');
const footerStatisticsElement = bodyElement.querySelector('.footer__statistics');


/*  Генерируем данные
   ========================================================================== */

const dataFilms = new Array(FILM_COUNT).fill().map(generateDataFilm);
const dataComments = generateDataComments();
const filters = generateFilter(dataFilms);


/*  Отрисовываем профиль
   ========================================================================== */

render(headerSiteElement, new ProfileView(filters));


/*  Отрисовываем меню
   ========================================================================== */

render(mainSiteElement, new SiteFilterView(filters));


/*  Отрисовываем фильмы
   ========================================================================== */

const movieListPresenter = new MovieListPresenter(mainSiteElement, bodyElement);
movieListPresenter.init(dataFilms, dataComments);


/*  Отрисовываем статистику в footer
   ========================================================================== */

render(footerStatisticsElement, new FooterStatisticsView(dataFilms));
