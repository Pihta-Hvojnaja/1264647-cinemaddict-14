
import Observer from './observer.js';

import { removeItemFromItems } from '../utils/remove-item.js';

export default class CommentsModel extends Observer {
  constructor() {
    super();
    this._dataComments;
  }

  getDataComments() {
    return this._dataComments;
  }

  setDataComments(dataComments) {
    this._dataComments = dataComments.slice();
  }

  updateDataComments(idComment) {
    this._dataComments = removeItemFromItems(this._dataComments, idComment);
    this._notify(updateType, updateDataFilm)
  }
}
