
//Содержит блоки ниже
const createSectionFilmsTemplate = () => {
  return `<section class="films">
          </section>`;
};

//Содержит карточки фильмов
const createFilmsListTemplate = () => {
  return `<section class="films-list">
            <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
            <div class="films-list__container"></div>
          </section>`;
};

//Топ рейтинга
const createListTopRatedTemplate = () => {
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Top rated</h2>
            <div class="films-list__container"></div>`;
};

//Наиболее откомментированные
const createListMostCommentedTemplate = () => {
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Most commented</h2>
            <div class="films-list__container"></div>`;
};

export {
  createSectionFilmsTemplate,
  createFilmsListTemplate,
  createListTopRatedTemplate,
  createListMostCommentedTemplate
};
