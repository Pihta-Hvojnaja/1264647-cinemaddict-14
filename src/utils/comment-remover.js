
export const createCommentRemover = (commentsComponent) => {
  commentsComponent.setClickDeleteHandler(() => {

    // удаляем комментарий
    commentsComponent.getCommentToDelete().remove();

    // меняем значение счетчика
    commentsComponent.getElement()
      .querySelector('.film-details__comments-count').textContent =
      commentsComponent.getElement()
        .querySelector('.film-details__comments-list').children.length;
  });
};
