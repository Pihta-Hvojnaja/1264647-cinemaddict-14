
import Observer from './observer.js';

import { removeItemFromItems } from '../utils/remove-item.js';

export default class CommentsModel extends Observer {
  constructor() {
    super();
    this._dataComments;
    this._dataComment;
  }

  getDataComments() {
    return this._dataComments;
  }

  setDataComments(dataComments) {
    this._dataComments = dataComments.slice();
  }

  setDataComment(updateType, dataComment) {
    this._dataComment = dataComment;
    this._notify(updateType);
  }

  updateDataComments(updateType, idComment) {
    this._dataComments = removeItemFromItems(this._dataComments, idComment);
    this._notify(updateType);
  }
}
