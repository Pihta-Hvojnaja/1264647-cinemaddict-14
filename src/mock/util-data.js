
/* Функции
   ========================================================================== */

/**
 *  Ф-ция генерации целого числа
 */

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 *  Ф-ция генерации числа с плавающей точкой
 */

const getRandomInclusive = (min, max, numberDigit) => parseFloat((Math.random() * (max - min) + min).toFixed(numberDigit));

/**
 *  Выбор случайного элемента из массива
 */

const getRandomElement = (items) => items[getRandomInteger(0, items.length - 1)];

/**
 *  Перетасовка массива
 */

const shuffle = (items) => {

  for (let i = items.length - 1; i > 0; i--) {
    const j = getRandomInteger(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
};

/**
 *  Ф-ция генерации массива случайной длинны с неповторяющимися элементами
 */

const getArrayRandomLength = (items, minCountElement = 0) => shuffle(items.slice()).slice(0, getRandomInteger(minCountElement, items.length));

/**
 *  Ф-ция собирает случайное описание
 */

const getRandomDescription = (description) => shuffle(description.split(/\.\s/).map((item) => item + '.')).slice(0, 5).join(' ');


export {
  getRandomInteger,
  getRandomInclusive,
  getRandomElement,
  getArrayRandomLength,
  getRandomDescription
};
