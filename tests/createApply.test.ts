import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { createApply } from '../lib/'

const suite = createSuite('createApply')

suite(`Applies classes with no prefix`, () => {
  const apply = createApply('')
  assert.equal(apply('w-full h-full'), {
    '@apply w-full h-full': {}
  })
})

suite('Applies classes with a prefix', () => {
  const apply = createApply('tw-')
  assert.equal(apply('w-full h-full'), {
    '@apply tw-w-full tw-h-full': {}
  })
})

suite('Handles excessive spaces and newlines', () => {
  const apply = createApply('tw-')
  assert.equal(apply(`w-full  
  
  
  h-full

  `), {
    '@apply tw-w-full tw-h-full': {}
  })
})

suite.run()
