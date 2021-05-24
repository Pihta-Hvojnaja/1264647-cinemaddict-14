
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

  setDataComments(dataComments, updateType) {
    this._dataComments = dataComments.slice();
    this._notify(updateType);
  }

  updateDataComments(idComment, updateType) {
    this._dataComments = removeItemFromItems(this._dataComments, idComment);
    this._notify(updateType);
  }

  addComment(update, updateType) {
    this._dataComments = [
      update,
      ...this._dataComments,
    ];

    this._notify(updateType, update);
  }
}
