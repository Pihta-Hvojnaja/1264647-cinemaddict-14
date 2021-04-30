
/**
 * Генерация целого числа
 * @param {number} min - минимальное значение диапазона
 * @param {number} max - максимальное значение диапазона
 * @returns {number} - целое число из диапазона
 */
export const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


/**
 * Генерация числа с плавающей точкой
 * @param {number} min - минимальное значение диапазона
 * @param {number} max - максимальное значение диапазона
 * @param {number} numberDigit - количество знаков после запятой
 * @returns {number} - возвращает число с плавающей точкой из диапазона
 */
export const getRandomInclusive = (min, max, numberDigit) => parseFloat((Math.random() * (max - min) + min).toFixed(numberDigit));


/**
 * Выбор случайного элемента из массива
 * @param {Array} items - массив
 * @returns {*} - возвращает случайный элемент массива
 */
export const getRandomElement = (items) => items[getRandomInteger(0, items.length - 1)];


/**
 * Перетасовка массива / Функция не создает копию массива
 * @param {Array} items - массив
 * @returns {Array} - возвращает перетасованный массив
 */
const shuffle = (items) => {

  for (let i = items.length - 1; i > 0; i--) {
    const j = getRandomInteger(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
};

/**
 * Генерация массива случайной длинны с неповторяющимися элементами
 * @param {Array} items - массив
 * @param {number} minCountElement - определяет минимальное количество элементов в массиве
 * @returns {Array} - возвращает массив случайной длинны с неповторяющимися элементами
 */
export const getArrayRandomLength = (items, minCountElement = 0) => shuffle(items.slice()).slice(0, getRandomInteger(minCountElement, items.length));


/**
 * Сборка случайного описания
 * @param {string} description - текст (набор предложений)
 * @returns {string} - возвращает текст из 5 случайных предложений
 */
export const getRandomDescription = (description) => shuffle(description.split(/\.\s/).map((item) => item + '.')).slice(0, 5).join(' ');
