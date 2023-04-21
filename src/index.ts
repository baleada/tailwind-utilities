import createPlugin from 'tailwindcss/plugin'

export type UtilitiesOptions = {
  only?: Utility[],
  except?: Utility[],
  flexDirectionAppliesDisplay?: boolean,
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
  only: ['center', 'corner', 'edge', 'dimension', 'stretch', 'gap modifiers'],
  except: [],
  flexDirectionAppliesDisplay: true,
}

/**
 * https://baleada.dev/docs/utilities
 */
export const plugin = createPlugin.withOptions((options: UtilitiesOptions = {}) => {
  const { only, except, flexDirectionAppliesDisplay } = { ...defaultOptions, ...options },
        utilities = only.filter(utility => !except.includes(utility)),
        { flex, flexRow, flexCol, grid } = utilities.includes('gap modifiers')
          ? {
            flex: ':is(.flex, .flex-row, .flex-col, [class*="flex/"], [class*="flex-row/"], [class*="flex-col/"])',
            flexRow: ':is(.flex, .flex-row, [class*="flex/"], [class*="flex-row/"]):not(:is(.flex-col, [class*="flex-col/"]))',
            flexCol: ':is(.flex-col, [class*="flex-col/"])',
            grid: ':is(.grid, [class*="grid/"])',
          }
          : {
            flex: '.flex',
            flexRow: '.flex',
            flexCol: '.flex-col',
            grid: '.grid',
          }
  
  return ({ addUtilities, matchUtilities, theme, config }) => {
    const prefix = config('prefix') as string,
          apply = createApply(prefix)

    if (utilities.includes('center')) {
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
          [`&:where(${flexRow})`]: apply('items-center justify-center'),
          [`&:where(${flexCol})`]: apply('items-center justify-center'),
          [`&:where(${grid})`]: apply('place-items-center'),
        },
        '.center-all-x': {
          [`&:where(${flexRow})`]: apply('justify-center'),
          [`&:where(${flexCol})`]: apply('items-center'),
          [`&:where(${grid})`]: apply('justify-items-center'),
        },
        '.center-all-y': {
          [`&:where(${flexRow})`]: apply('items-center'),
          [`&:where(${flexCol})`]: apply('justify-center'),
          [`&:where(${grid})`]: apply('items-center'),
        },        
      })
    }

    if (utilities.includes('corner')) {
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
          [`&:where(${flex})`]: apply('items-start justify-start'),
          [`&:where(${grid})`]: apply('place-items-start'),
        },
        '.corner-all-t-r': {
          [`&:where(${flexRow})`]: apply('items-start justify-end'),
          [`&:where(${flexCol})`]: apply('items-end justify-start'),
          [`&:where(${grid})`]: apply('items-start place-items-end'),
        },
        '.corner-all-b-r': {
          [`&:where(${flex})`]: apply('items-end justify-end'),
          [`&:where(${grid})`]: apply('place-items-end'),
        },
        '.corner-all-b-l': {
          [`&:where(${flexRow})`]: apply('items-end justify-start'),
          [`&:where(${flexCol})`]: apply('items-start justify-end'),
          [`&:where(${grid})`]: apply('items-end place-items-start'),
        },
      })
    }

    if (utilities.includes('edge')) {
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
          [`&:where(${grid})`]: apply('justify-items-center'),
          [`&:where(${flexRow})`]: apply('justify-center'),
          [`&:where(${flexCol})`]: apply('items-center'),
        },
        '.edge-all-r': {
          [`&:where(${grid})`]: apply('items-center place-items-end'),
          [`&:where(${flexRow})`]: apply('items-center justify-end'),
          [`&:where(${flexCol})`]: apply('items-end justify-center'),
        },
        '.edge-all-b': {
          [`&:where(${grid})`]: apply('justify-items-center place-items-end'),
          [`&:where(${flexRow})`]: apply('justify-center items-end'),
          [`&:where(${flexCol})`]: apply('items-center justify-end'),
        },
        '.edge-all-l': {
          [`&:where(${grid})`]: apply('items-center'),
          [`&:where(${flexRow})`]: apply('items-center'),
          [`&:where(${flexCol})`]: apply('justify-center'),
        },    
      })
    }

    if (utilities.includes('dimension')) {
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

    if (utilities.includes('gap modifiers')) {
      const directionRE = /-(?:col|row)$/

      for (const identifier of ['flex', 'flex-row', 'flex-col', 'grid']) {
        matchUtilities(
          {
            [identifier]: (value, { modifier }) => ({
              ...(
                ['flex', 'grid'].includes(identifier)
                  ? { display: identifier }
                  : {}
              ),
              ...(
                (flexDirectionAppliesDisplay && directionRE.test(identifier))
                  ? { display: 'flex' }
                  : {}
              ),
              ...(() => {
                if (identifier === 'flex-col') return { flexDirection: 'column' }
                if (identifier === 'flex-row') return { flexDirection: 'row' }
                return {}
              })(),
              ...(modifier ? { gap: modifier } : {}),
            }),
          },
          {
            values: { DEFAULT: '' },
            type: 'length',
            modifiers: {
              ...theme('spacing'),
              ...theme('gap'),
            },
          }
        )
      }
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
