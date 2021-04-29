
import AbstractView from './abstract.js';
import { SortType } from '../const.js';


const createSortTemplate = () => {
  return `<ul class="sort">
            <li>
              <a data-sort-type="${SortType.DEFAULT}" href="#" class="sort__button sort__button--active">
                Sort by default
              </a>
            </li>
            <li>
              <a data-sort-type="${SortType.DATE}" href="#" class="sort__button">
                Sort by date
              </a>
            </li>
            <li>
              <a data-sort-type="${SortType.RATING}" href="#" class="sort__button">
                Sort by rating
              </a>
            </li>
          </ul>`;
};


export default class Sort extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    const currentBtnElement = evt.target;
    const nameActiveClass = 'sort__button--active';
    const allButtonElements = this.getElement().querySelectorAll('a');

    if (currentBtnElement.tagName !== 'A') {
      return;
    }

    if (!currentBtnElement.classList.contains(nameActiveClass)) {
      allButtonElements.forEach((button) => {
        button.classList.remove(nameActiveClass);
      });

      currentBtnElement.classList.add(nameActiveClass);
    }

    this._callback.sortTypeChange(currentBtnElement.dataset.sortType);
  }
}
