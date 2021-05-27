
import { UpdateType } from './const.js';
import { render, replaceComponent } from './utils/render.js';
import { toast } from './utils/toast.js';

import FooterStatisticsView from './view/footer-statistics.js';

import FilterModel from './model/filter-model.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

import FilterPresenter from './presenter/filter-presenter.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';


const AUTHORIZATION = 'Basic userPihta_4';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const STORE_FILMS_PREFIX = 'cinemaddict-localstorage-films';
const STORE_FILMS_VER = 'v14';

const STORE_COMMENTS_PREFIX = 'cinemaddict-localstorage-comments';
const STORE_COMMENTS_VER = 'v14';

const STORE_FILMS_NAME = `${STORE_FILMS_PREFIX}-${STORE_FILMS_VER}`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_COMMENTS_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store, STORE_FILMS_NAME, STORE_COMMENTS_NAME);

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
  apiWithProvider,
);

filterPresenter.init();
movieListPresenter.init();

const footerStatisticsComponent = new FooterStatisticsView(moviesModel.getDataFilms());
render(footerStatisticsElement, footerStatisticsComponent);

apiWithProvider.getDataFilms()
  .then((dataFilms) => {
    moviesModel.setDataFilms(dataFilms, UpdateType.INIT);
    replaceComponent(new FooterStatisticsView(moviesModel.getDataFilms()), footerStatisticsComponent);
  })
  .catch(() => {
    moviesModel.setDataFilms([], UpdateType.INIT);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  toast('Доступ к сети восстановлен', true);
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('Приложение перешло в режим оффлайн');
});
