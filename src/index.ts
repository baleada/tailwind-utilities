import createPlugin from 'tailwindcss/plugin'

export type UtilitiesOptions = {
  only?: Utility[],
  except?: Utility[],
}

export type Utility = 'center' | 'corner' | 'edge' | 'dimension' | 'stretch'

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
  only: ['center', 'corner', 'edge', 'dimension', 'stretch'],
  except: [],
}

/**
 * https://baleada.dev/docs/utilities
 */
export const plugin = createPlugin.withOptions((options: UtilitiesOptions = {}) => {
  const { only, except } = { ...defaultOptions, ...options }

  const utilities = only.filter(utility => !except.includes(utility))
  
  return ({ addUtilities, matchUtilities, theme, config }) => {
    const prefix = config('prefix') as string
    const apply = createApply(prefix)

    if (utilities.includes('center')) {
      addUtilities({
        '.center': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-center mx-auto'),
          '&:where(.flex.flex-col > &)': apply('self-center my-auto'),
          '&:where(.grid > &)': apply('place-self-center'),
          '&:where(.absolute, .fixed, .sticky)': apply('top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'),
        },
        '.center-x': {
          '&:where(.flex:not(.flex-col) > &)': apply('mx-auto'),
          '&:where(.flex.flex-col > &)': apply('self-center'),
          '&:where(.grid > &)': apply('justify-self-center'),
          '&:where(.absolute, .fixed, .sticky)': apply('left-1/2 -translate-x-1/2'),
        },
        '.center-y': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-center'),
          '&:where(.flex.flex-col > &)': apply('my-auto'),
          '&:where(.grid > &)': apply('self-center'),
          '&:where(.absolute, .fixed, .sticky)': apply('top-1/2 -translate-y-1/2'),
        },
        '.center-all': {
          '&:where(.flex)': apply('items-center justify-center'),
          '&:where(.grid)': apply('place-items-center'),
        },
        '.center-all-x': {
          '&:where(.grid)': apply('justify-items-center'),
          '&:where(.flex:not(.flex-col))': apply('justify-center'),
          '&:where(.flex.flex-col)': apply('items-center'),
        },
        '.center-all-y': {
          '&:where(.grid)': apply('items-center'),
          '&:where(.flex:not(.flex-col))': apply('items-center'),
          '&:where(.flex.flex-col)': apply('justify-center'),
        },        
      })
    }

    if (utilities.includes('corner')) {
      addUtilities({
        '.corner-t-l': {
          '&:where(.flex > &)': apply('self-start'),
          '&:where(.grid > &)': apply('place-self-start'),
          '&:where(.absolute, .fixed, .sticky)': apply('top-0 left-0'),
        },
        '.corner-t-r': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-start ml-auto'),
          '&:where(.flex.flex-col > &)': apply('self-end'),
          '&:where(.grid > &)': apply('self-start ml-auto'),
          '&:where(.absolute, .fixed, .sticky)': apply('top-0 right-0'),
        },
        '.corner-b-r': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-end ml-auto'),
          '&:where(.flex.flex-col > &)': apply('self-end mt-auto'),
          '&:where(.grid > &)': apply('place-self-end'),
          '&:where(.absolute, .fixed, .sticky)': apply('bottom-0 right-0'),
        },
        '.corner-b-l': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-end'),
          '&:where(.flex.flex-col > &)': apply('self-start mt-auto'),
          '&:where(.grid > &)': apply('self-end'),
          '&:where(.absolute, .fixed, .sticky)': apply('bottom-0 left-0'),
        },
        '.corner-all-t-l': {
          '&:where(.flex)': apply('items-start justify-start'),
          '&:where(.grid)': apply('place-items-start'),
        },
        '.corner-all-t-r': {
          '&:where(.flex:not(.flex-col))': apply('items-start justify-end'),
          '&:where(.flex.flex-col)': apply('items-end justify-start'),
          '&:where(.grid)': apply('items-start place-items-end'),
        },
        '.corner-all-b-r': {
          '&:where(.flex)': apply('items-end justify-end'),
          '&:where(.grid)': apply('place-items-end'),
        },
        '.corner-all-b-l': {
          '&:where(.flex:not(.flex-col))': apply('items-end justify-start'),
          '&:where(.flex.flex-col)': apply('items-start justify-end'),
          '&:where(.grid)': apply('items-end place-items-start'),
        },
      })
    }

    if (utilities.includes('edge')) {
      addUtilities({
        '.edge-t': {
          '&:where(.flex:not(.flex-col) > &)': apply('mx-auto'),
          '&:where(.flex.flex-col > &)': apply('self-center'),
          '&:where(.grid > &)': apply('justify-self-center'),
          '&:where(.absolute, .fixed, .sticky)': apply('left-1/2 -translate-x-1/2'),
        },
        '.edge-r': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-center ml-auto'),
          '&:where(.flex.flex-col > &)': apply('self-end my-auto'),
          '&:where(.grid > &)': apply('self-center place-self-end'),
          '&:where(.absolute, .fixed, .sticky)': apply('top-1/2 -translate-y-1/2 right-0'),
        },
        '.edge-b': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-end mx-auto'),
          '&:where(.flex.flex-col > &)': apply('self-center mt-auto'),
          '&:where(.grid > &)': apply('self-end justify-self-center'),
          '&:where(.absolute, .fixed, .sticky)': apply('bottom-0 left-1/2 -translate-x-1/2'),
        },
        '.edge-l': {
          '&:where(.flex:not(.flex-col) > &)': apply('self-center'),
          '&:where(.flex.flex-col > &)': apply('my-auto'),
          '&:where(.grid > &)': apply('self-center'),
          '&:where(.absolute, .fixed, .sticky)': apply('left-0 top-1/2 -translate-y-1/2'),
        },
        '.edge-all-t': {
          '&:where(.grid)': apply('justify-items-center'),
          '&:where(.flex:not(.flex-col))': apply('justify-center'),
          '&:where(.flex.flex-col)': apply('items-center'),
        },
        '.edge-all-r': {
          '&:where(.grid)': apply('items-center place-items-end'),
          '&:where(.flex:not(.flex-col))': apply('items-center justify-end'),
          '&:where(.flex.flex-col)': apply('items-end justify-center'),
        },
        '.edge-all-b': {
          '&:where(.grid)': apply('justify-items-center place-items-end'),
          '&:where(.flex:not(.flex-col))': apply('justify-center items-end'),
          '&:where(.flex.flex-col)': apply('items-center justify-end'),
        },
        '.edge-all-l': {
          '&:where(.grid)': apply('items-center'),
          '&:where(.flex:not(.flex-col))': apply('items-center'),
          '&:where(.flex.flex-col)': apply('justify-center'),
        },    
      })
    }

    if (utilities.includes('dimension')) {
      const values = {
        ...theme('height'),
        ...theme('width'),
        ...theme('dimension'),
      }
      
      matchUtilities(
        {
          d: (value, { modifier }) => ({
            height: toHeight(value),
            width: toWidth(modifier || value),
          }),
        },
        {
          values: {
            ...theme('height'),
            ...theme('width'),
            ...theme('dimension'),
          },
          type: 'any', // Necessary to support custom v% and cq% units
          modifiers: values,
        }
      )
    }

    if (utilities.includes('stretch')) {
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

function toWidth(heightOrArbitraryValue: string) {
  return heightOrArbitraryValue
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
