/**
 * @class Event
 */
export default class Event {
  /**
   * @constructor
   */
  constructor () {
    this._flag = false
    this._promises = []
  }

  /**
   * @return {boolean}
   */
  isSet () {
    return this._flag
  }

  /**
   */
  set () {
    this._flag = true
    for (let promise of this._promises) {
      promise.resolve(true)
      clearTimeout(promise.timeoutId)
    }
  }

  /**
   */
  clear () {
    this._flag = false
  }

  /**
   * @param {number} timeout
   * @return {Promise.<boolean>}
   */
  wait (timeout) {
    if (this._flag) {
      return Promise.resolve(true)
    }

    return new Promise((resolve) => {
      let deferred = {resolve: resolve, timeoutId: null}
      this._promises.push(deferred)

      if (isFinite(timeout) && timeout > -1) {
        deferred.timeoutId = setTimeout(() => {
          let idx = this._promises.indexOf(deferred)
          if (idx !== -1) {
            this._promises.splice(idx, 1)
          }

          resolve(false)
        }, timeout)
      }
    })
  }
}
