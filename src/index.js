import getCustomPromise from 'custom-promise-for-package'

export default getCustomPromise((Promise) => {
  return {
    Semaphore: require('./semaphore')(Promise)
  }
})
