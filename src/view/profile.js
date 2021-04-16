
import { createElement } from './../util.js';

/*  Функция возвращает поле рейтинга в профиле
   ========================================================================== */

const createFilterItemTemplate = (count) => {
  let status;

  if (count >= 1 && count <= 10) {
    status = 'Novice';

  } else if (count >= 11 && count <= 20) {
    status = 'Fan';

  } else {
    status = 'Movie Buff';
  }

  return `<p class="profile__rating">${status}</p>`;
};


/*  Функция возвращает шаблон профиля
   ========================================================================== */

const createProfileTemplate = (filters) => {
  const [ , history] = filters;

  return history.count === 0 ? null : `<section class="header__profile profile">
                                ${createFilterItemTemplate(history.count)}
                                <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
                              </section>`;
};


export default class Profile {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element !== null ?  this._element : '';
  }

  removeElement() {
    this._element = null;
  }
}
