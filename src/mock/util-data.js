
/* Функции
   ========================================================================== */

/**
 *  Генерация целого числа
 */

export const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 *  Генерация числа с плавающей точкой
 */

export const getRandomInclusive = (min, max, numberDigit) => parseFloat((Math.random() * (max - min) + min).toFixed(numberDigit));

/**
 *  Выбор случайного элемента из массива
 */

export const getRandomElement = (items) => items[getRandomInteger(0, items.length - 1)];

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
 *  Генерация массива случайной длинны с неповторяющимися элементами
 */

export const getArrayRandomLength = (items, minCountElement = 0) => shuffle(items.slice()).slice(0, getRandomInteger(minCountElement, items.length));

/**
 *  Сборка случайного описания
 */

export const getRandomDescription = (description) => shuffle(description.split(/\.\s/).map((item) => item + '.')).slice(0, 5).join(' ');
