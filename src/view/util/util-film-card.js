
/**
 *  Ф-ция ограничивает длинну описания фильма
 */

const getDescription = (description) => {
  return description.length > 140 ?
    description.substring(0, 139) + '...' : description;
};


export { getDescription };
