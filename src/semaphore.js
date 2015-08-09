export default function (Promise) {
  /**
   * @class Semaphore
   */
  class Semaphore {
    /**
     * @param {number} [value=1]
     */
    constructor (value = 1) {
      this._value = (isFinite(value) && value > 0) || value === Infinity ? value : 1
      this._count = 0
      this._queue = []
    }

    /**
     * @param {Object} [opts]
     * @param {boolean} [opts.blocking=true]
     * @param {number} [opts.timeout=Infinity]
     * @return {Promise<boolean>}
     */
    acquire (opts = {blocking: true, timeout: Infinity}) {
      if (Object(opts).blocking === false) {
        if (this._count === this._value) {
          return Promise.resolve(false)
        }

        this._count += 1
        return Promise.resolve(true)
      }

      if (this._count < this._value) {
        this._count += 1
        return Promise.resolve(true)
      }

      return new Promise((resolve) => {
        var deferred = {timeoutId: null, resolve: resolve}
        this._queue.push(deferred)

        var timeout = Object(opts).timeout
        if (isFinite(timeout) && timeout > -1) {
          deferred.timeoutId = setTimeout(() => {
            this._queue.splice(this._queue.indexOf(deferred), 1)
            resolve(false)
          }, timeout)
        }
      })
      .then((isAllowed) => {
        if (isAllowed) {
          this._count += 1
        }

        return isAllowed
      })
    }

    /**
     */
    release () {
      if (this._count === 0) {
        return
      }

      this._count -= 1
      if (this._queue.length > 0) {
        var deferred = this._queue.shift()
        clearTimeout(deferred.timeoutId)
        deferred.resolve(true)
      }
    }

    /**
     * @param {function} fn
     * @param {Object} [opts]
     * @param {boolean} [opts.blocking=true]
     * @param {number} [opts.timeout=Infinity]
     * @return {Promise<[boolean, *]>}
     */
    withLock (fn, opts = {blocking: true, timeout: Infinity}) {
      return new Promise((resolve, reject) => {
        this.acquire(opts).then(resolve, reject)
      })
      .then((isAcquired) => {
        if (!isAcquired) {
          return [false]
        }

        return Promise.resolve()
          .then(() => { return fn() })
          .then((value) => { return [true, value] })
      })
      .then((result) => {
        this.release()
        return result
      }, (reason) => {
        this.release()
        throw reason
      })
    }
  }

  return Semaphore
}
