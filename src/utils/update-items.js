
/**
 * Функция обновляет массив объектов: заменяет в масиве устаревший объект на обновленный
 * @param {Array} items - изначальный массив объектов
 * @param {Object} update - обновленный объект
 * @returns {Array} - либо изначальный массив объектов / либо обновленный массив объектов
 */
export const updateItems = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
