
/**
 *  Топ рейтинга
 */

export const getTopRated = (dataFilms) => dataFilms.slice()
  .sort((firstElement, secondElement) =>
    secondElement.filmInfo.totalRating - firstElement.filmInfo.totalRating);

/**
 *  Топ комментариев
 */

export const getMostCommented = (dataFilms) => dataFilms.slice()
  .sort((firstElement, secondElement) =>
    secondElement.comments.length - firstElement.comments.length);
