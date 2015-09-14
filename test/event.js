import { expect } from 'chai'

import { Event } from '../src'

describe('Event', () => {
  it('wait event', async () => {
    let event = new Event()
    setTimeout(::event.set, 1)
    let signaled = await event.wait()
    expect(signaled).to.be.true
  })

  it('wait event return false', async () => {
    let event = new Event()
    let signaled = await event.wait(1)
    expect(signaled).to.be.false
  })

  it('isSet', () => {
    let event = new Event()
    expect(event.isSet()).to.be.false
    event.set()
    expect(event.isSet()).to.be.true
    event.clear()
    expect(event.isSet()).to.be.false
  })
})
