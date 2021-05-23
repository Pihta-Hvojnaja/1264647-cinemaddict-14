
import MoviesModel from './model/movies-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getDataFilms() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((dataFilms) => dataFilms.map(MoviesModel.adaptToClient));
  }

  getDataComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then(Api.toJSON);
  }

  updateDataFilm(dataFilm) {
    return this._load({
      url: `movies/${dataFilm.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(dataFilm)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  deleteDataComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  addDataComment(filmId, dataComment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(dataComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((response) => {

        return {
          movie: MoviesModel.adaptToClient(response.movie),
          comments: response.comments,
        };
      });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),

  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
