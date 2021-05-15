
import { render } from './utils/render.js';

import { generateDataFilm } from './mock/data-film.js';
import { generateDataComments } from './mock/data-comments.js';

import FooterStatisticsView from './view/footer-statistics.js';

import FilterModel from './model/filter-model.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

import FilterPresenter from './presenter/filter-presenter.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';


/* VARIABLE
   ========================================================================== */

const FILM_COUNT = 20;

const bodyElement = document.querySelector('body');
const headerSiteElement = bodyElement.querySelector('.header');
const mainSiteElement = bodyElement.querySelector('.main');
const footerStatisticsElement = bodyElement.querySelector('.footer__statistics');


/* DATA
   ========================================================================== */

const dataFilms = new Array(FILM_COUNT).fill().map(generateDataFilm);
const filterModel = new FilterModel();
const moviesModel = new MoviesModel();
moviesModel.setDataFilms(dataFilms);

const dataComments = generateDataComments();
const commentsModel = new CommentsModel();
commentsModel.setDataComments(dataComments);


/* FILTER
   ========================================================================== */

const filterPresenter = new FilterPresenter(headerSiteElement, mainSiteElement, filterModel, moviesModel);
filterPresenter.init();


/* BOARD FILMS
   ========================================================================== */

const movieListPresenter = new MovieListPresenter(
  mainSiteElement,
  bodyElement,
  moviesModel,
  commentsModel,
  filterModel,
);

movieListPresenter.init();


/* FOOTER
   ========================================================================== */

render(footerStatisticsElement, new FooterStatisticsView(moviesModel.getDataFilms()));
