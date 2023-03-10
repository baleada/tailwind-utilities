import createPlugin from 'tailwindcss/plugin'

export type UtilitiesOptions = {
  spaceToggle?: {
    namespace?: string,
    whitespace?: ' ' | '/**/',
  },
}

export type Utility = 'center' | 'corner' | 'edge' | 'dimension' | 'stretch' | 'gap modifiers'

export function defineDimensionConfig (dimension: Record<string | number, string>): Record<string | number, string> {
  return dimension
}

export function toDimensionTheme (dimension: Record<string | number, string>): { dimension: Record<string | number, string> } {
  return { dimension }
}

export function defineStretchWidthConfig (stretchWidth: Record<string | number, string>): Record<string | number, string> {
  return stretchWidth
}

export function toStretchWidthTheme (stretchWidth: Record<string | number, string>): { stretchWidth: Record<string | number, string> } {
  return { stretchWidth }
}

export function defineStretchHeightConfig (stretchHeight: Record<string | number, string>): Record<string | number, string> {
  return stretchHeight
}

export function toStretchHeightTheme (stretchHeight: Record<string | number, string>): { stretchHeight: Record<string | number, string> } {
  return { stretchHeight }
}

const defaultOptions: UtilitiesOptions = {
  spaceToggle: {
    namespace: 'baleada',
    whitespace: ' ',
  }
}

/**
 * https://baleada.dev/docs/utilities
 */
export const plugin = createPlugin.withOptions((options: UtilitiesOptions = {}) => {
  const spaceToggleConfig = { ...defaultOptions.spaceToggle, ...(options.spaceToggle || {}) } as Parameters<typeof createSpaceToggle>[0]
  
  return ({ addUtilities, matchUtilities, theme, config }) => {
    const prefix = config('prefix') as string,
          apply = createApply(prefix),
          { toNamespaced, toOr, toAnd, toVar, toCondition, toValue } = createSpaceToggle(spaceToggleConfig)

    // FLEX/GRID OVERRIDES, INCLUDING GAP MODIFIERS
    ;(() => {
      const toGap = (modifier: string | undefined) => modifier ? { gap: modifier } : {},
            matchUtilitiesOptions: Parameters<typeof matchUtilities<string, string>>[1] = {
              values: { DEFAULT: '' },
              type: 'length',
              // @ts-expect-error
              modifiers: { ...theme('spacing'), ...theme('gap') },
            }

      matchUtilities(
        {
          'flex': (value, { modifier }) => ({
            ...toCondition('flex', true),
            ...toCondition('flex-row', true),
            ...toCondition('flex-col', false),
            ...toCondition('grid', false),
            display: 'flex',
            ...toGap(modifier),
          })
        },
        matchUtilitiesOptions
      )

      matchUtilities(
        {
          'flex-row': (value, { modifier }) => ({
            ...toCondition('flex', true),
            ...toCondition('flex-row', true),
            ...toCondition('flex-col', false),
            ...toCondition('grid', false),
            display: 'flex',
            flexDirection: 'row',
            ...toGap(modifier),
          })
        },
        matchUtilitiesOptions
      )

      matchUtilities(
        {
          'flex-col': (value, { modifier }) => ({
            ...toCondition('flex', true),
            ...toCondition('flex-row', false),
            ...toCondition('flex-col', true),
            ...toCondition('grid', false),
            display: 'flex',
            flexDirection: 'column',
            ...toGap(modifier),
          })
        },
        matchUtilitiesOptions
      )

      matchUtilities(
        {
          'grid': (value, { modifier }) => ({
            ...toCondition('flex', false),
            ...toCondition('flex-row', false),
            ...toCondition('flex-col', false),
            ...toCondition('grid', true),
            display: 'grid',
            ...toGap(modifier),
          })
        },
        matchUtilitiesOptions
      )
    })()

    // CENTER
    ;(() => {
      addUtilities({
        '.center': {
          [`&:where(${flexRow} > &)`]: apply('self-center mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center my-auto'),
          [`&:where(${grid} > &)`]: apply('place-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'),
        },
        '.center-x': {
          [`&:where(${flexRow} > &)`]: apply('mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center'),
          [`&:where(${grid} > &)`]: apply('justify-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('left-1/2 -translate-x-1/2'),
        },
        '.center-y': {
          [`&:where(${flexRow} > &)`]: apply('self-center'),
          [`&:where(${flexCol} > &)`]: apply('my-auto'),
          [`&:where(${grid} > &)`]: apply('self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('top-1/2 -translate-y-1/2'),
        },
        '.center-all': {
          alignItems: toValue(
            toOr('flex-row', 'flex-col', 'grid'),
            'center',
          ),
          justifyContent: toValue(
            toOr('flex-row', 'flex-col'),
            toVar('not-grid'),
            'center',
          ),
          justifyItems: toValue(
            toAnd('grid', 'not-flex'),
            'center'
          )
        },
        '.center-all-x': {
          alignItems: toValue(
            toAnd('flex-col', 'not-grid'),
            'center',
          ),
          justifyContent: toValue(
            toAnd('flex-row', 'not-grid'),
            'center',
          ),
          justifyItems: toValue(
            toVar('grid'),
            'center'
          ),
        },
        '.center-all-y': {
          alignItems: toValue(
            toOr('flex-row', 'grid'),
            'center',
          ),
          justifyContent: toValue(
            toAnd('flex-col', 'not-grid'),
            'center',
          ),
        },        
      })
    })()

    // CORNER
    ;(() => {
      addUtilities({
        '.corner-t-l': {
          [`&:where(${flex} > &)`]: apply('self-start'),
          [`&:where(${grid} > &)`]: apply('place-self-start'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('top-0 left-0'),
        },
        '.corner-t-r': {
          [`&:where(${flexRow} > &)`]: apply('self-start ml-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-end'),
          [`&:where(${grid} > &)`]: apply('self-start ml-auto'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('top-0 right-0'),
        },
        '.corner-b-r': {
          [`&:where(${flexRow} > &)`]: apply('self-end ml-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-end mt-auto'),
          [`&:where(${grid} > &)`]: apply('place-self-end'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('bottom-0 right-0'),
        },
        '.corner-b-l': {
          [`&:where(${flexRow} > &)`]: apply('self-end'),
          [`&:where(${flexCol} > &)`]: apply('self-start mt-auto'),
          [`&:where(${grid} > &)`]: apply('self-end'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('bottom-0 left-0'),
        },
        '.corner-all-t-l': {
          alignItems: 'start',
          justifyContent: toValue(
            toVar('not-grid'),
            'start',
          ),
          justifyItems: 'start',
        },
        '.corner-all-t-r': {
          [toNamespaced('items-start-if-flex-row-or-grid')]: toValue(
            toOr('flex-row', 'grid'),
            'start'
          ),
          [toNamespaced('items-end-if-flex-col')]: toValue(
            toVar('flex-col'),
            'end'
          ),
          alignItems: toOr('items-start-if-flex-row-or-grid', 'items-end-if-flex-col'),
          [toNamespaced('justify-end-if-flex-row')]: toValue(
            toVar('flex-row'),
            'end'
          ),
          [toNamespaced('justify-start-if-flex-col')]: toValue(
            toVar('flex-col'),
            'start'
          ),
          justifyContent: toOr('justify-end-if-flex-row', 'justify-start-if-flex-col'),
          justifyItems: toValue(toVar('grid'), 'end'),
        },
        '.corner-all-b-r': {
          alignItems: 'end',
          justifyContent: toValue(
            toVar('not-grid'),
            'end',
          ),
          justifyItems: 'end',
        },
        '.corner-all-b-l': {
          [toNamespaced('items-end-if-flex-row-or-grid')]: toValue(
            toOr('flex-row', 'grid'),
            'end'
          ),
          [toNamespaced('items-start-if-flex-col')]: toValue(
            toVar('flex-col'),
            'start'
          ),
          alignItems: toOr('items-end-if-flex-row-or-grid', 'items-start-if-flex-col'),
          [toNamespaced('justify-start-if-flex-row')]: toValue(
            toVar('flex-row'),
            'start'
          ),
          [toNamespaced('justify-end-if-flex-col')]: toValue(
            toVar('flex-col'),
            'end'
          ),
          justifyContent: toOr('justify-start-if-flex-row', 'justify-end-if-flex-col'),
          justifyItems: toValue(toVar('grid'), 'start'),
        },
      })
    })()

    // EDGE
    ;(() => {
      addUtilities({
        '.edge-t': {
          [`&:where(${flexRow} > &)`]: apply('mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center'),
          [`&:where(${grid} > &)`]: apply('justify-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('left-1/2 -translate-x-1/2'),
        },
        '.edge-r': {
          [`&:where(${flexRow} > &)`]: apply('self-center ml-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-end my-auto'),
          [`&:where(${grid} > &)`]: apply('self-center place-self-end'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('top-1/2 -translate-y-1/2 right-0'),
        },
        '.edge-b': {
          [`&:where(${flexRow} > &)`]: apply('self-end mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center mt-auto'),
          [`&:where(${grid} > &)`]: apply('self-end justify-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('bottom-0 left-1/2 -translate-x-1/2'),
        },
        '.edge-l': {
          [`&:where(${flexRow} > &)`]: apply('self-center'),
          [`&:where(${flexCol} > &)`]: apply('my-auto'),
          [`&:where(${grid} > &)`]: apply('self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: apply('left-0 top-1/2 -translate-y-1/2'),
        },
        '.edge-all-t': {
          alignItems: toValue(toVar('flex-col'), 'center'),
          justifyContent: toValue(toVar('flex-row'), 'center'),
          justifyItems: toValue(toVar('grid'), 'center'),
        },
        '.edge-all-r': {
          [toNamespaced('items-center-if-flex-row-or-grid')]: toValue(
            toOr('flex-row', 'grid'),
            'center'
          ),
          [toNamespaced('items-end-if-flex-col')]: toValue(
            toVar('flex-col'),
            'end'
          ),
          alignItems: toOr('items-center-if-flex-row-or-grid', 'items-end-if-flex-col'),
          [toNamespaced('justify-end-if-flex-row')]: toValue(
            toVar('flex-row'),
            'end'
          ),
          [toNamespaced('justify-center-if-flex-col')]: toValue(
            toVar('flex-col'),
            'center'
          ),
          justifyContent: toOr('justify-end-if-flex-row', 'justify-center-if-flex-col'),
          justifyItems: toValue(toVar('grid'), 'end'),
        },
        '.edge-all-b': {
          [toNamespaced('items-end-if-flex-row-or-grid')]: toValue(
            toOr('flex-row', 'grid'),
            'end'
          ),
          [toNamespaced('items-center-if-flex-col')]: toValue(
            toVar('flex-col'),
            'center'
          ),
          alignItems: toOr('items-end-if-flex-row-or-grid', 'items-center-if-flex-col'),
          [toNamespaced('justify-center-if-flex-row')]: toValue(
            toVar('flex-row'),
            'center'
          ),
          [toNamespaced('justify-end-if-flex-col')]: toValue(
            toVar('flex-col'),
            'end',
          ),
          justifyContent: toOr('justify-center-if-flex-row', 'justify-end-if-flex-col'),
          justifyItems: toValue(toVar('grid'), 'center'),
        },
        '.edge-all-l': {
          alignItems: toValue(
            toOr('flex-row', 'grid'),
            'center'
          ),
          justifyContent: toValue(toVar('flex-col'), 'center'),
        },    
      })
    })()

    // DIMENSION
    ;(() => {
      const values = {
        ...theme('width'),
        ...theme('height'),
        ...theme('dimension'),
      }
      
      matchUtilities(
        {
          d: (value, { modifier }) => ({
            width: toWidth(value),
            height: toHeight(modifier || value),
          }),
        },
        {
          values,
          type: 'any', // Necessary to support custom v% and cq% units
          modifiers: values,
        }
      )
    })()

    // STRETCH
    ;(() => {
      matchUtilities(
        {
          'stretch-w': value => apply(`w-full max-w-[${value}]`),
        },
        {
          values: { ...theme('maxWidth'), ...theme('stretchWidth') },
          type: 'length',
        }
      )
      
      matchUtilities(
        {
          'stretch-h': value => apply(`h-full max-h-[${value}]`),
        },
        {
          values: { ...theme('maxHeight'), ...theme('stretchHeight') },
          type: 'length',
        }
      )
    })()
  }
})

const flex = ':is(.flex, .flex-row, .flex-col, [class*="flex/"], [class*="flex-row/"], [class*="flex-col/"])',
      flexRow = ':is(.flex, .flex-row, [class*="flex/"], [class*="flex-row/"]):not(:is(.flex-col, [class*="flex-col/"]))',
      flexCol = ':is(.flex-col, [class*="flex-col/"])',
      grid = ':is(.grid, [class*="grid/"])'

export function createApply (prefix: string) {
  return function apply (classes: string): { [statement: `@apply ${string}`]: Record<never, never> } {
    const withMinimizedWhitespace = classes
            .replace(whitespaceRE, ' ')
            .trim(),
          withPrefix = prefix
            ? withMinimizedWhitespace
              .replace(startRE, prefix)
              .replace(spaceRE, ` ${prefix}`)
            : withMinimizedWhitespace
    return {
      [`@apply ${withPrefix}`]: {}
    }
  }
}
const whitespaceRE = /(?:\n| ){2,}/gm
const startRE = /^/
const spaceRE = / /g

function toHeight(height: string) {
  return height
    .replace(vwRE, (_, value) => `${value}vh`)
    .replace(cqwRE, (_, value) => `${value}cqh`)
    .replace(vPercentRE, (_, value) => `${value}vh`)
    .replace(cqPercentRE, (_, value) => `${value}cqh`)
}

function toWidth(width: string) {
  return width
    .replace(vhRE, (_, value) => `${value}vw`)
    .replace(cqhRE, (_, value) => `${value}cqw`)
    .replace(vPercentRE, (_, value) => `${value}vw`)
    .replace(cqPercentRE, (_, value) => `${value}cqw`)
}

const vhRE = /(\d+)vh/g
const vwRE = /(\d+)vw/g
const cqhRE = /(\d+)cqh/g
const cqwRE = /(\d+)cqw/g
const vPercentRE = /(\d+)v%/g
const cqPercentRE = /(\d+)cq%/g

export function createSpaceToggle ({ namespace, whitespace }: { namespace: string, whitespace: ' ' | '/**/' }) {
  const toNamespaced = (variable: string) => `--${namespace}-${variable}`,
        toNamespacedNot = (variable: string) => `--${namespace}-not-${variable}`,
        toOr = (...variables: string[]) => variables
          .slice()
          .reverse()
          .reduce(
            (or, variable, index) => index === 0
              ? toVar(variable)
              : `var(${toNamespaced(variable)}, ${or})`,
            ''
          ),
        toAnd = (...variables: string[]) => variables
          .map(variable => toVar(variable))
          .join(' '),
        toVar = (variable: string) => `var(${toNamespaced(variable)})`,
        toCondition = (variable: string, value: boolean) => ({
          [toNamespaced(variable)]: value ? whitespace : 'initial',
          [toNamespacedNot(variable)]: value ? 'initial' : whitespace,
        }),
        toValue = (...conditionsOrResult: string[]) => conditionsOrResult.join(' ')

  return {
    toNamespaced,
    toNamespacedNot,
    toOr,
    toAnd,
    toVar,
    toCondition,
    toValue,
  }
}
