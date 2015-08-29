export function createTestFunction (fn) {
  return function (done) {
    Promise.resolve().then(fn).then(done, done)
  }
}
