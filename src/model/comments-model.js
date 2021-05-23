
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

  getDataComment() {
    return this._dataComment;
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

  addComment(updateType, update) {
    this._dataComments = [
      ...this._dataComments,
      update,
    ];

    this._notify(updateType, update);
  }
}
