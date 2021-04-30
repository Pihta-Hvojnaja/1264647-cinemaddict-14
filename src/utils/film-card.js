
const LENGTH_DESCRIPTION = 139;

/**
 * Функция ограничивает длинну описания фильма
 * @param {string} description - полное описание фильма в виде строки
 * @returns {string} - полное или обрезанное описание
 */
export const clipDescription = (description) => {
  return description.length > (LENGTH_DESCRIPTION + 1) ?
    description.substring(0, LENGTH_DESCRIPTION) + '...' : description;
};
