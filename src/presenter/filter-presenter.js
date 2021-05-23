
import ProfileView from '../view/profile.js';
import SiteFilterView from '../view/site-filter.js';

import {render, replaceComponent, removeComponent} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  constructor(profileContainer, filterContainer, filterModel, moviesModal) {
    this._profileContainer = profileContainer;
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModal = moviesModal;

    this._filterComponent = null;
    this._filters = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._onModelEvent);
    this._moviesModal.addObserver(this._onModelEvent);
  }

  init() {
    this._countFilms = null;
    this._filters = this._getFilters();

    const prevProfileComponent = this._profileComponent;
    const prevFilterComponent = this._filterComponent;

    this._profileComponent = new ProfileView(this.getCountCurrentFilter(FilterType.HISTORY));
    this._filterComponent = new SiteFilterView(this._filters, this._filterModel.getFilter(), this._countFilms);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    if (prevProfileComponent === null || prevFilterComponent === null) {
      render(this._profileContainer, this._profileComponent);
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replaceComponent(this._profileComponent, prevProfileComponent);
    replaceComponent(this._filterComponent, prevFilterComponent);
    removeComponent(prevProfileComponent);
    removeComponent(prevFilterComponent);
  }

  getCountCurrentFilter(typeFilter) {
    return this._filters.find((filter) => filter.type === typeFilter).count;
  }

  _getFilters() {
    const dataFilms = this._moviesModal.getDataFilms();
    this._countFilms = dataFilms.length;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](dataFilms).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](dataFilms).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](dataFilms).length,
      },
    ];
  }

  _onFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    if (filterType === FilterType.ADDITIONAL) {
      this._filterModel.setFilter(UpdateType.ADDITIONAL, filterType);
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _onModelEvent() {
    this.init();
  }
}
