
import AbstractView from './abstract.js';

const createButtonShowMoreTemplate = () => {
  return `<button class="films-list__show-more">
            Show more
          </button>`;
};

export default class ButtonShowMore extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  getTemplate() {
    return createButtonShowMoreTemplate(this._dataFilm);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }
}
