
/**
 *  Ф-ция переформатирует время из mm -> h mm
 */

const getRuntime = (runtime) => {
  if (runtime > 59) {
    const resultHours = `${(runtime / 60 + '').split('.')[0]}h`;
    const resultMinutes = (runtime % 60) === 0 ? '' : `${runtime % 60}m`;

    return `${resultHours} ${resultMinutes}`;

  } else {
    return `${runtime}m`;
  }
};


export {
  getRuntime
};
