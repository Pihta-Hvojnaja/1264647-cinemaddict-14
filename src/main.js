
import { UpdateType } from './const.js';
import { render, replaceComponent } from './utils/render.js';

import FooterStatisticsView from './view/footer-statistics.js';

import FilterModel from './model/filter-model.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

import FilterPresenter from './presenter/filter-presenter.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';

import Api from './api.js';

const AUTHORIZATION = 'Basic userPihta_4';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const bodyElement = document.querySelector('body');
const headerSiteElement = bodyElement.querySelector('.header');
const mainSiteElement = bodyElement.querySelector('.main');
const footerStatisticsElement = bodyElement.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const filterPresenter = new FilterPresenter(headerSiteElement, mainSiteElement, filterModel, moviesModel);
const movieListPresenter = new MovieListPresenter(
  mainSiteElement,
  bodyElement,
  moviesModel,
  commentsModel,
  filterModel,
  filterPresenter,
  api,
);

filterPresenter.init();
movieListPresenter.init();

const footerStatisticsComponent = new FooterStatisticsView(moviesModel.getDataFilms());
render(footerStatisticsElement, footerStatisticsComponent);

api.getDataFilms()
  .then((dataFilms) => {
    moviesModel.setDataFilms(dataFilms, UpdateType.INIT);
    replaceComponent(new FooterStatisticsView(moviesModel.getDataFilms()), footerStatisticsComponent);
  })
  .catch(() => {
    moviesModel.setDataFilms([], UpdateType.INIT);
  });
