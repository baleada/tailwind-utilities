import createPlugin from 'tailwindcss/plugin'

export type UtilitiesOptions = {
  only?: Utility[],
  except?: Utility[],
}

export type Utility = 'center' | 'dimension'

export function defineDimensionConfig (dimension: Record<string | number, string>): Record<string | number, string> {
  return dimension
}

export function toDimensionTheme (dimension: Record<string | number, string>): { dimension: Record<string | number, string> } {
  return { dimension }
}

const defaultOptions: UtilitiesOptions = {
  only: ['center', 'dimension'],
}

/**
 * https://baleada.dev/docs/utilities
 */
export const plugin = createPlugin.withOptions((options: UtilitiesOptions = {}) => {
  const { only, except } = { ...defaultOptions, ...options }

  const utilities = only.filter(utility => !except.includes(utility))
  
  return ({ addUtilities, matchUtilities, theme }) => {
    if (utilities.includes('center')) {
      addUtilities({
        '.center': {
          '&:where(.flex > &)': apply('m-auto'),
          '&:where(.grid > &)': apply('place-self-center'),
          '&:where(.absolute)': apply('top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'),
        },
        '.center-x': {
          '&:where(.flex > &)': apply('mx-auto'),
          '&:where(.grid > &)': apply('justify-self-center'),
          '&:where(.absolute)': apply('left-1/2 -translate-x-1/2'),
        },
        '.center-y': {
          '&:where(.flex > &)': apply('my-auto'),
          '&:where(.grid > &)': apply('self-center'),
          '&:where(.absolute)': apply('top-1/2 -translate-y-1/2'),
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

    if (utilities.includes('dimension')) {
      matchUtilities(
        {
          d: (value) => ({
            height: toHeight(value),
            width: toWidth(value),
          }),
        },
        {
          values: {
            ...theme('height'),
            ...theme('width'),
            ...theme('dimension'),
          }
        }
      )
    }
  }
})

export function apply (classes: string): { [apply: `@apply ${string}`]: Record<never, never> } {
  return {
    [`@apply ${classes}`]: {}
  }
}

function toHeight(height) {
  return height
    .replace(vPercentRE, (_, value) => `${value}vh`)
    .replace(cqPercentRE, (_, value) => `${value}cqh`)
}

function toWidth(height) {
  return height
    .replace(vhRE, (_, value) => `${value}vw`)
    .replace(cqhRE, (_, value) => `${value}cqw`)
    .replace(vPercentRE, (_, value) => `${value}vw`)
    .replace(cqPercentRE, (_, value) => `${value}cqw`)
}

const vhRE = /(\d+)vh/g
const cqhRE = /(\d+)cqh/g
const vPercentRE = /(\d+)v%/g
const cqPercentRE = /(\d+)cq%/g
