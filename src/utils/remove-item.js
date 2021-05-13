
const NUMBER_ITEMS_DELETE = 1;

/**
 * Функция обновляет массив объектов: удаляет нужный элемент из массива
 * @param {Array} items - изначальный массив
 * @param {number} idComment - id удаляемого элемента массива
 * @returns {Array} - либо изначальный (если элемент не найден) / либо обновленный массив
 */
export const removeItemFromItems = (items, idComment) => {

  const index = items.findIndex(
    (item) => (typeof item === 'object') ? item.id === idComment : item === idComment,
  );

  if (index === -1) {
    return items;
  }

  items = items.slice();
  items.splice(index, NUMBER_ITEMS_DELETE);

  return items;
};
