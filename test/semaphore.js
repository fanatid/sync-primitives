import { expect } from 'chai'

function runTests (Promise) {
  var Semaphore = require('../src')(Promise).Semaphore

  function getLockedSemaphore () {
    var semaphore = new Semaphore(1)
    return semaphore.acquire()
      .then((isAcquired) => {
        expect(isAcquired).to.be.true
        return semaphore
      })
  }

  describe('blocking is false', () => {
    it('semaphore is unlocked', (done) => {
      var semaphore = new Semaphore(1)
      semaphore.acquire({blocking: false})
        .then((isAcquired) => {
          expect(isAcquired).to.be.true
        })
        .then(done, done)
    })

    it('semaphore already locked', (done) => {
      getLockedSemaphore()
        .then((semaphore) => {
          return semaphore.acquire({blocking: false})
        })
        .then((isAcquired) => {
          expect(isAcquired).to.be.false
        })
        .then(done, done)
    })
  })

  describe('timeout is not Infinity', () => {
    it('rejected by timeout', (done) => {
      getLockedSemaphore()
        .then((semaphore) => {
          var startTime = Date.now()
          return semaphore.acquire({timeout: 100})
            .then((isAcquired) => {
              expect(isAcquired).to.be.false
              expect(Date.now() - startTime).to.be.at.least(99)
            })
        })
        .then(done, done)
    })
  })

  it('release unlocked semaphore', () => {
    var semaphore = new Semaphore(1)
    expect(::semaphore.release).to.not.throw()
  })

  it('wait for acquire', (done) => {
    getLockedSemaphore()
      .then((semaphore) => {
        var startTime = Date.now()
        setTimeout(() => { semaphore.release() }, 100)

        return semaphore.acquire()
          .then((isAcquired) => {
            expect(isAcquired).to.be.true
            expect(Date.now() - startTime).to.be.at.least(99)
          })
      })
      .then(done, done)
  })

  describe('withLock', () => {
    it('executed', (done) => {
      var semaphore = new Semaphore(1)
      semaphore.withLock(() => {
        return new Promise((resolve) => {
          setTimeout(() => { resolve('h1') }, 100)
        })
      })
      .then((result) => {
        expect(result[0]).to.be.true
        expect(result[1]).to.equal('h1')
      })

      var startTime = Date.now()
      semaphore.acquire()
        .then(() => {
          expect(Date.now() - startTime).to.be.at.least(99)
        })
        .then(done, done)
    })

    it('already locked', (done) => {
      getLockedSemaphore()
        .then((semaphore) => {
          return semaphore.withLock(() => {}, {blocking: false})
        })
        .then((result) => {
          expect(result[0]).to.be.false
        })
        .then(done, done)
    })
  })
}

var promises = {
  'Promise': Promise,
  'bluebird': require('bluebird'),
  'lie': require('lie')
}

Object.keys(promises).forEach((key) => {
  describe(key, () => { runTests(promises[key]) })
})
