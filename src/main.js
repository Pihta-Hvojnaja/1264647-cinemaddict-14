
import { render } from './utils/render.js';

import { generateDataFilm } from './mock/data-film.js';
import { generateDataComments } from './mock/data-comments.js';
import { generateFilter } from './mock/filter.js';

import ProfileView from './view/profile.js';
import SiteFilterView from './view/site-filter.js';
import FooterStatisticsView from './view/footer-statistics.js';

import MovieListPresenter from './presenter/movie-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';


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
const moviesModel = new MoviesModel();
moviesModel.setDataFilms(dataFilms);

const dataComments = generateDataComments();
const commentsModel = new CommentsModel();
commentsModel.setDataComments(dataComments);

const filters = generateFilter(moviesModel.getDataFilms());


/* PROFILE
   ========================================================================== */

render(headerSiteElement, new ProfileView(filters));


/* FILTER
   ========================================================================== */

render(mainSiteElement, new SiteFilterView(filters));


/* BOARD FILMS
   ========================================================================== */

const movieListPresenter = new MovieListPresenter(mainSiteElement, bodyElement, moviesModel, commentsModel);
movieListPresenter.init(dataFilms, dataComments);


/* FOOTER
   ========================================================================== */

render(footerStatisticsElement, new FooterStatisticsView(moviesModel.getDataFilms()));
