
import AbstractView from './abstract.js';

const createNoCommentsTemplate = () => {
  return `<section class="film-details__comments">
            <h3 class="film-details__comments-title">
              We couldn't upload the comments. Network problems..
            </h3>
          </section>`;
};

export default class NoComments extends AbstractView {
  getTemplate() {
    return createNoCommentsTemplate();
  }
}
