
export const updateDataWatchlist = (dataFilm) => {
  return Object.assign(
    {},
    dataFilm,
    {
      userDetails: {
        watchlist: !dataFilm.userDetails.watchlist,
        alreadyWatched: dataFilm.userDetails.alreadyWatched,
        watchingDate: dataFilm.userDetails.watchingDate,
        favorite: dataFilm.userDetails.favorite,
      },
    },
  );
};

export const updateDataWatched = (dataFilm) => {
  return Object.assign(
    {},
    dataFilm,
    {
      userDetails: {
        watchlist: dataFilm.userDetails.watchlist,
        alreadyWatched: !dataFilm.userDetails.alreadyWatched,
        watchingDate: dataFilm.userDetails.watchingDate,
        favorite: dataFilm.userDetails.favorite,
      },
    },
  );
};

export const updateDataFavorite = (dataFilm) => {
  return Object.assign(
    {},
    dataFilm,
    {
      userDetails: {
        watchlist: dataFilm.userDetails.watchlist,
        alreadyWatched: dataFilm.userDetails.alreadyWatched,
        watchingDate: dataFilm.userDetails.watchingDate,
        favorite: !dataFilm.userDetails.favorite,
      },
    },
  );
};
