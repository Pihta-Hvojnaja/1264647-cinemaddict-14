export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getItems(storeKey) {
    try {
      return JSON.parse(this._storage.getItem(storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(storeKey, items) {
    this._storage.setItem(
      storeKey,
      JSON.stringify(items),
    );
  }

  setItem(storeKey, key, value) {
    const store = this.getItems(storeKey);

    this._storage.setItem(
      storeKey,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        }),
      ),
    );
  }

  removeItem(storeKey, key, id) {
    const store = this.getItems(storeKey);

    if (id) {
      const comments = store[key];
      store[key] = comments.filter((item) => item.id !== id);
    } else {
      delete store[key];
    }

    this._storage.setItem(
      storeKey,
      JSON.stringify(store),
    );
  }
}
