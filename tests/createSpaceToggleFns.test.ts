import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { createSpaceToggleFns } from '../lib'

type Context = {
  variableNamespace: string,
}
const suite = createSuite<Context>('createSpaceToggleFns')
suite.before(context => {
  context.variableNamespace = 'baleada'
})

suite(`creates toNamespaced`, ({ variableNamespace }) => {
  const { toNamespaced } = createSpaceToggleFns(variableNamespace)

  assert.is(toNamespaced('a'), '--baleada-a')
})

suite(`creates toOr`, ({ variableNamespace }) => {
  const { toOr } = createSpaceToggleFns(variableNamespace)

  assert.is(toOr('a'), 'var(--baleada-a)')
  assert.is(toOr('a', 'b', 'c'), 'var(--baleada-a, var(--baleada-b, var(--baleada-c)))')
})

suite(`creates toAnd`, ({ variableNamespace }) => {
  const { toAnd } = createSpaceToggleFns(variableNamespace)

  assert.is(toAnd('a'), 'var(--baleada-a)')
  assert.is(toAnd('a', 'b', 'c'), 'var(--baleada-a) var(--baleada-b) var(--baleada-c)')
})

suite(`creates toVar`, ({ variableNamespace }) => {
  const { toVar } = createSpaceToggleFns(variableNamespace)

  assert.is(toVar('a'), 'var(--baleada-a)')
})

suite(`creates toCondition`, ({ variableNamespace }) => {
  const { toCondition } = createSpaceToggleFns(variableNamespace)

  assert.equal(
    toCondition('a', true),
    {
      '--baleada-a': ' ',
      '--baleada-not-a': 'initial',
    }
  )

  assert.equal(
    toCondition('a', false),
    {
      '--baleada-a': 'initial',
      '--baleada-not-a': ' ',
    }
  )
})

suite(`creates toValue`, ({ variableNamespace }) => {
  const { toValue } = createSpaceToggleFns(variableNamespace)

  assert.is(toValue('var(--baleada-a)', 'blue'), 'var(--baleada-a) blue')
})

suite.run()
