
import { createElement } from '../util.js';

const createSectionFilmsTemplate = () => {
  return `<section class="films">
            <section id="all-films" class="films-list">
              <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

              <div class="films-list__container">
              </div>
            </section>

            <section id="top-rated" class="films-list films-list--extra">
              <h2 class="films-list__title">Top rated</h2>

              <div class="films-list__container">
              </div>
            </section>

            <section id="most-commented" class="films-list films-list--extra">
              <h2 class="films-list__title">Most commented</h2>

              <div class="films-list__container">
              </div>
            </section>
          </section>`;
};

export default class SectionFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSectionFilmsTemplate();
  }

  getElement() {
    if (!this._element) {
      return this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
