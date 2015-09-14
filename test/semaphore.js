import { expect } from 'chai'

import { Semaphore } from '../src'

function runTests (Promise) {
  async function getLockedSemaphore () {
    let semaphore = new Semaphore(1)
    let isAcquired = await semaphore.acquire()
    expect(isAcquired).to.be.true
    return semaphore
  }

  describe('blocking is false', () => {
    it('semaphore is unlocked', async () => {
      let semaphore = new Semaphore(1)
      let isAcquired = await semaphore.acquire({blocking: false})
      expect(isAcquired).to.be.true
    })

    it('semaphore already locked', async () => {
      let semaphore = await getLockedSemaphore()
      let isAcquired = await semaphore.acquire({blocking: false})
      expect(isAcquired).to.be.false
    })
  })

  describe('timeout is not Infinity', () => {
    it('rejected by timeout', async () => {
      let semaphore = await getLockedSemaphore()
      let startTime = Date.now()
      let isAcquired = await semaphore.acquire({timeout: 100})
      expect(isAcquired).to.be.false
      expect(Date.now() - startTime).to.be.at.least(99)
    })
  })

  it('release unlocked semaphore', () => {
    let semaphore = new Semaphore(1)
    expect(::semaphore.release).to.not.throw()
  })

  it('wait for acquire', async () => {
    let semaphore = await getLockedSemaphore()
    let startTime = Date.now()
    setTimeout(() => { semaphore.release() }, 100)

    let isAcquired = await semaphore.acquire()
    expect(isAcquired).to.be.true
    expect(Date.now() - startTime).to.be.at.least(99)
  })

  describe('withLock', () => {
    it('executed', async () => {
      let semaphore = new Semaphore(1)

      let f1 = async () => {
        let result = await semaphore.withLock(() => {
          return new Promise((resolve) => {
            setTimeout(() => { resolve('h1') }, 100)
          })
        })
        expect(result).to.deep.equal([true, 'h1'])
      }

      let f2 = async () => {
        let startTime = Date.now()
        await semaphore.acquire()
        expect(Date.now() - startTime).to.be.at.least(99)
      }

      await* [f1(), f2()]
    })

    it('already locked', async () => {
      let semaphore = await getLockedSemaphore()
      let result = await semaphore.withLock(() => {}, {blocking: false})
      expect(result[0]).to.be.false
    })
  })
}

let promises = {
  'Promise': Promise,
  'bluebird': require('bluebird'),
  'lie': require('lie')
}

for (let key of Object.keys(promises)) {
  describe(key, () => { runTests(promises[key]) })
}
