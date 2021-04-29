
const ONE_HOUR = 60;

/**
 * Функция переформатирует время из _mm -> в _h _mm
 * @param {number} runtime - длительность фильма в формате "число минут"
 * @returns {string} - возвращает строку, содержащую длительность фильма в формате _h _mm
 */
export const reformatRuntime = (runtime) => {

  if (runtime < ONE_HOUR) {
    return `${runtime}m`;
  }

  const hours = Math.floor(runtime / ONE_HOUR);
  const minutes = runtime % ONE_HOUR;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};
