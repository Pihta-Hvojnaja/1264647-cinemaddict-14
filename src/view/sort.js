
import AbstractView from './abstract.js';
import { SortType } from '../const.js';


const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
            <li>
              <a class="sort__button${currentSortType === SortType.DEFAULT ? ' sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}" href="#">
                Sort by default
              </a>
            </li>
            <li>
              <a class="sort__button${currentSortType === SortType.DATE ? ' sort__button--active' : ''}" data-sort-type="${SortType.DATE}" href="#">
                Sort by date
              </a>
            </li>
            <li>
              <a class="sort__button${currentSortType === SortType.RATING ? ' sort__button--active' : ''}" data-sort-type="${SortType.RATING}" href="#">
                Sort by rating
              </a>
            </li>
          </ul>`;
};


export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
