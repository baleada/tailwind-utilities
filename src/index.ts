import createPlugin from 'tailwindcss/plugin'

export type UtilitiesOptions = {
  spaceToggle?: {
    namespace?: string,
    whitespace?: ' ' | '/**/',
  },
  maxGridTemplate?: number,
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

const defaultOptions: DeepRequired<UtilitiesOptions> = {
  spaceToggle: {
    namespace: 'baleada',
    whitespace: ' ',
  },
  maxGridTemplate: 12,
}

type DeepRequired<Object extends Record<any, any>> = {
  [Key in keyof Object]-?: Object[Key] extends Record<any, any> ? DeepRequired<Object[Key]> : Object[Key]
}

/**
 * https://baleada.dev/docs/utilities
 */
export const plugin = createPlugin.withOptions((options: UtilitiesOptions = {}) => {
  const { maxGridTemplate, spaceToggle: spaceToggleConfig } = { ...defaultOptions, ...options },
        narrowedSpaceToggleConfig = { ...defaultOptions.spaceToggle, ...spaceToggleConfig }
  
  return ({ addUtilities, matchUtilities, theme, config }) => {
    const prefix = config('prefix') as string,
          apply = createApply(prefix),
          { toNamespaced, toOr, toAnd, toVar, toCondition, toValue } = createSpaceToggleFns(narrowedSpaceToggleConfig),
          toGridValues = createToGridValues({ maxGridTemplate })

    // FLEX/GRID OVERRIDES, INCLUDING GAP MODIFIERS
    {
      const toGap = (modifier: string | undefined) => modifier ? { gap: modifier } : {},
            toGridTemplate = (value: `cols-${number}` | `rows-${number}` | '') => {
              if (!value) return {}

              const [type, count] = value.split('-')

              return {
                [`gridTemplate${type === 'cols' ? 'Columns' : 'Rows'}`]: count === 'none' ? 'none' : `repeat(${count}, minmax(0, 1fr))`,
              }
            },
            matchUtilitiesOptions: Parameters<typeof matchUtilities<string, string>>[1] = {
              type: 'any',
              // @ts-expect-error
              modifiers: { ...theme('spacing'), ...theme('gap') },
            }

      matchUtilities(
        {
          'flex': (value, { modifier }) => ({
            ...toCondition('flex', true),
            ...toCondition('flex-row', !value || ['row', 'row-reverse'].includes(value)),
            ...toCondition('flex-col', ['col', 'col-reverse'].includes(value)),
            ...toCondition('grid', false),
            display: 'flex',
            flexDirection: value.startsWith('col')
              ? value.replace('col', 'column')
              : value || 'row',
            ...toGap(modifier),
          })
        },
        {
          ...matchUtilitiesOptions,
          values: {
            DEFAULT: '',
            row: 'row',
            col: 'col',
            'row-reverse': 'row-reverse',
            'col-reverse': 'col-reverse',
          },
        }
      )

      matchUtilities(
        {
          'grid': (value, { modifier }) => ({
            ...toCondition('flex', false),
            ...toCondition('flex-row', false),
            ...toCondition('flex-col', false),
            ...toCondition('grid', true),
            display: 'grid',
            ...toGridTemplate(value as `cols-${number}` | `rows-${number}` | ''),
            ...toGap(modifier),
          })
        },
        {
          ...matchUtilitiesOptions,
          values: {
            DEFAULT: '',
            ...toGridValues('cols'),
            ...toGridValues('rows'),
          }
        }
      )
    }

    // POSITION OVERRIDES
    {
      for (const position of ['absolute', 'fixed', 'relative', 'sticky', 'static']) {
        addUtilities({
          [`.${position}`]: {
            position,
            ...toCondition('static', position === 'static'),
            ...toCondition('fixed', position === 'fixed'),
            ...toCondition('absolute', position === 'absolute'),
            ...toCondition('relative', position === 'relative'),
            ...toCondition('sticky', position === 'sticky'),
          }
        })
      }
    }

    // CENTER
    {
      addUtilities({
        '.center': {
          [`&:where(${flexRow} > &)`]: apply('self-center mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center my-auto'),
          [`&:where(${grid} > &)`]: apply('place-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ...apply('transform'),
          }
        },
        '.center-x': {
          [`&:where(${flexRow} > &)`]: apply('mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center'),
          [`&:where(${grid} > &)`]: apply('justify-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ...apply('transform'),
          }
        },
        '.center-y': {
          [`&:where(${flexRow} > &)`]: apply('self-center'),
          [`&:where(${flexCol} > &)`]: apply('my-auto'),
          [`&:where(${grid} > &)`]: apply('self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            //apply('top-1/2 -translate-y-1/2'),
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ...apply('transform'),
          }
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
    }

    // CORNER
    {
      addUtilities({
        '.corner-t-l': {
          [`&:where(${flex} > &)`]: apply('self-start'),
          [`&:where(${grid} > &)`]: apply('place-self-start'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
          }
        },
        '.corner-t-r': {
          [`&:where(${flexRow} > &)`]: apply('self-start ml-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-end'),
          [`&:where(${grid} > &)`]: apply('self-start ml-auto'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
            right: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
          }
        },
        '.corner-b-r': {
          [`&:where(${flexRow} > &)`]: apply('self-end ml-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-end mt-auto'),
          [`&:where(${grid} > &)`]: apply('place-self-end'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            bottom: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
            right: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
          }
        },
        '.corner-b-l': {
          [`&:where(${flexRow} > &)`]: apply('self-end'),
          [`&:where(${flexCol} > &)`]: apply('self-start mt-auto'),
          [`&:where(${grid} > &)`]: apply('self-end'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            bottom: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
          }
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
    }

    // EDGE
    {
      addUtilities({
        '.edge-t': {
          [`&:where(${flexRow} > &)`]: apply('mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center'),
          [`&:where(${grid} > &)`]: apply('justify-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ...apply('transform'),
          }
        },
        '.edge-r': {
          [`&:where(${flexRow} > &)`]: apply('self-center ml-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-end my-auto'),
          [`&:where(${grid} > &)`]: apply('self-center place-self-end'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            right: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ...apply('transform'),
          }
        },
        '.edge-b': {
          [`&:where(${flexRow} > &)`]: apply('self-end mx-auto'),
          [`&:where(${flexCol} > &)`]: apply('self-center mt-auto'),
          [`&:where(${grid} > &)`]: apply('self-end justify-self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            bottom: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ...apply('transform'),
          }
        },
        '.edge-l': {
          [`&:where(${flexRow} > &)`]: apply('self-center'),
          [`&:where(${flexCol} > &)`]: apply('my-auto'),
          [`&:where(${grid} > &)`]: apply('self-center'),
          [`&:where(.absolute, .fixed, .sticky)`]: {
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '0',
            ),
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '50%',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              toAnd('not-static', 'not-relative'),
              '-50%',
            ),
            ...apply('transform'),
          }
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
    }

    // DIMENSION
    {
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
    }

    // STRETCH
    {
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
    }
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

export function createSpaceToggleFns ({ namespace, whitespace }: { namespace: string, whitespace: ' ' | '/**/' }) {
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

function createToGridValues ({ maxGridTemplate }: { maxGridTemplate: number }) {
  return (template: 'cols' | 'rows') => {
    return new Array(maxGridTemplate)
      .fill(0)
      .map((_, index) => index + 1)
      .reduce(
        (gridValues, count) => ({ ...gridValues, [`${template}-${count}`]: `${template}-${count}` }),
        { [`${template}-none`]: `${template}-none` }
      )
  }
}
