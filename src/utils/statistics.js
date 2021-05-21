
export const getCountRuntimeFilms = (dataFilms) => {
  let countRuntimeFilms = 0;

  if (dataFilms.length === 0) {
    return countRuntimeFilms;
  }

  dataFilms.forEach((dataFilm) => {
    countRuntimeFilms += dataFilm.filmInfo.runtime;
  });

  return countRuntimeFilms;
};


const getAllGenres = (dataFilms) => {
  const allGenres = [];

  dataFilms.forEach((dataFilm) => {
    allGenres.push(...dataFilm.filmInfo.genre);
  });

  return allGenres;
};

const getGenresNames = (allGenres) => {
  const genresNames = new Set();

  allGenres.sort().forEach((genre) => {
    genresNames.add(genre);
  });

  return genresNames;
};


export const getGenres = (dataFilms) => {
  const genres = [];

  if (dataFilms.length === 0) {
    return genres;
  }

  const allGenres = getAllGenres(dataFilms);
  const genresNames = getGenresNames(allGenres);


  genresNames.forEach((genreName) => {
    let count = 0;

    allGenres.forEach((genre) => {
      if (genre === genreName) {
        count += 1;
      }
    });

    genres.push({genreName: genreName, count: count});
  });

  return genres.sort((firstGenre, secondGenre) => {
    return secondGenre.count - firstGenre.count;
  });
};
