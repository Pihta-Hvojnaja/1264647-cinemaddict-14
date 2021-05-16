
import Observer from './observer.js';

import {FilterType} from '../const.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType);
  }

  getFilter() {
    return this._activeFilter;
  }
}
