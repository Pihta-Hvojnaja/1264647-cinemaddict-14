
export const createCommentRemover = (commentsComponent) => {
  commentsComponent.setClickHandler(() => {

    // удаляем комментарий
    commentsComponent.getEvt().target.closest('.film-details__comment').remove();

    // меняем значение счетчика
    commentsComponent.getElement()
      .querySelector('.film-details__comments-count').textContent =
      commentsComponent.getElement()
        .querySelector('.film-details__comments-list').children.length;
  });
};
