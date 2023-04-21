import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { createSpaceToggle } from '../src'

type Context = {
  namespace: string,
  whitespace: ' ' | '/**/',
}
const suite = createSuite<Context>('createSpaceToggle')
suite.before(context => {
  context.namespace = 'baleada'
  context.whitespace = ' '
})

suite(`creates toNamespaced`, ({ namespace, whitespace }) => {
  const { toNamespaced } = createSpaceToggle({ namespace, whitespace })

  assert.is(toNamespaced('a'), '--baleada-a')
})

suite(`creates toOr`, ({ namespace, whitespace }) => {
  const { toOr } = createSpaceToggle({ namespace, whitespace })

  assert.is(toOr('a'), 'var(--baleada-a)')
  assert.is(toOr('a', 'b', 'c'), 'var(--baleada-a, var(--baleada-b, var(--baleada-c)))')
})

suite(`creates toAnd`, ({ namespace, whitespace }) => {
  const { toAnd } = createSpaceToggle({ namespace, whitespace })

  assert.is(toAnd('a'), 'var(--baleada-a)')
  assert.is(toAnd('a', 'b', 'c'), 'var(--baleada-a) var(--baleada-b) var(--baleada-c)')
})

suite(`creates toVar`, ({ namespace, whitespace }) => {
  const { toVar } = createSpaceToggle({ namespace, whitespace })

  assert.is(toVar('a'), 'var(--baleada-a)')
})

suite(`creates toCondition`, ({ namespace, whitespace }) => {
  const { toCondition } = createSpaceToggle({ namespace, whitespace })

  assert.equal(
    toCondition('a', true),
    {
      '--baleada-a': whitespace,
      '--baleada-not-a': 'initial',
    }
  )

  assert.equal(
    toCondition('a', false),
    {
      '--baleada-a': 'initial',
      '--baleada-not-a': whitespace,
    }
  )
})

suite(`creates toValue`, ({ namespace, whitespace }) => {
  const { toValue } = createSpaceToggle({ namespace, whitespace })

  assert.is(toValue('var(--baleada-a)', 'blue'), 'var(--baleada-a) blue')
})

suite.run()
