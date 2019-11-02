/* eslint-disable no-underscore-dangle */

class ChurchillError extends Error {
  constructor(msg, data) {
    super(msg);
    this._data = data;
  }

  get data() {
    return this._data;
  }
}

module.exports = { ChurchillError };
