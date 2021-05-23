
import { api,  UpdateType } from './const.js';
import { render, replaceComponent } from './utils/render.js';

import FooterStatisticsView from './view/footer-statistics.js';

import FilterModel from './model/filter-model.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

import FilterPresenter from './presenter/filter-presenter.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';

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
);

filterPresenter.init();
movieListPresenter.init();

const footerStatisticsComponent = new FooterStatisticsView(moviesModel.getDataFilms());
render(footerStatisticsElement, footerStatisticsComponent);

api.getDataFilms()
  .then((dataFilms) => {
    moviesModel.setDataFilms(UpdateType.INIT, dataFilms);
    replaceComponent(new FooterStatisticsView(moviesModel.getDataFilms()), footerStatisticsComponent);
  })
  .catch(() => {
    moviesModel.setDataFilms(UpdateType.INIT, []);
  });
