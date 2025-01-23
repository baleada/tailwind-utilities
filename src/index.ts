import createPlugin from 'tailwindcss/plugin'
import flattenColorPalette from 'tailwindcss/src/util/flattenColorPalette.js'
import withAlphaVariable from 'tailwindcss/src/util/withAlphaVariable.js'

export type UtilitiesOptions = {
  variableNamespace?: string,
  maxGridTemplate?: number,
  majorVersion?: 3 | 4,
}

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
  variableNamespace: 'baleada',
  maxGridTemplate: 12,
  majorVersion: 4,
}

type DeepRequired<Object extends Record<any, any>> = {
  [Key in keyof Object]-?: Object[Key] extends Record<any, any> ? DeepRequired<Object[Key]> : Object[Key]
}

/**
 * https://baleada.dev/docs/utilities
 */
export const plugin = createPlugin.withOptions((options: UtilitiesOptions = {}) => {
  const { maxGridTemplate, variableNamespace, majorVersion } = { ...defaultOptions, ...options }
  
  return ({ addBase, addUtilities, matchUtilities, theme, config, corePlugins }) => {
    const prefix = config('prefix') as string,
          apply = createApply(prefix),
          { toNamespaced, toOr, toAnd, toVar, toCondition, toValue } = createSpaceToggleFns(variableNamespace),
          toGridValues = createToGridValues(maxGridTemplate)
    


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
            ...toGridTemplate(
              value as `cols-${number}` | `rows-${number}` | ''),
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

      // GRID SHORTHAND
      matchUtilities(
        {
          'grid-sh': (value, { modifier }) => {
            const [cols, rows] = (value || '').split('x')

            return {
              ...toCondition('flex', false),
              ...toCondition('flex-row', false),
              ...toCondition('flex-col', false),
              ...toCondition('grid', true),
              display: 'grid',
              ...toGridTemplate(cols && `cols-${cols}` as `cols-${number}`),
              ...toGridTemplate(rows && `rows-${rows}` as `rows-${number}`),
              ...toGap(modifier),
            }
          }
        },
        {
          ...matchUtilitiesOptions,
          values: { DEFAULT: '' },
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
          [`&:where(${alignable} > &)`]: {
            alignSelf: toValue(
              toOr('flex-row', 'flex-col', 'grid'),
              'center',
            ),
            justifySelf: toValue(
              toOr('grid'),
              'center',
            ),
            ...mx(toValue(
              toOr('flex-row'),
              'auto',
            )),
            ...my(toValue(
              toOr('flex-col'),
              'auto',
            )),
          },
          [`&:where(${absolute})`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            translate: 'var(--tw-translate-x) var(--tw-translate-y)',
          },
        },
        '.center-x': {
          [`&:where(${alignable} > &)`]: {
            alignSelf: toValue(
              toOr('flex-col'),
              'center',
            ),
            justifySelf: toValue(
              toOr('grid'),
              'center',
            ),
            ...mx(toValue(
              toOr('flex-row'),
              'auto',
            )),
          },
          [`&:where(${absolute})`]: {
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            translate: 'var(--tw-translate-x) var(--tw-translate-y)',
          }
        },
        '.center-y': {
          [`&:where(${alignable} > &)`]: {
            alignSelf: toValue(
              toOr('flex-row', 'grid'),
              'center',
            ),
            ...my(toValue(
              toOr('flex-col'),
              'auto',
            ))
          },
          [`&:where(${absolute})`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            translate: 'var(--tw-translate-x) var(--tw-translate-y)',
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
          [`&:where(${alignable} > &)`]: {
            alignSelf: toValue(
              toOr('flex-row', 'flex-col', 'grid'),
              'self-start',
            ),
            justifySelf: toValue(
              toOr('grid'),
              'self-start',
            ),
          },
          [`&:where(${absolute})`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
          },
        },
        '.corner-t-r': {
          [`&:where(${alignable} > &)`]: {
            [toNamespaced('items-start-if-flex-row-or-grid')]: toValue(
              toOr('flex-row', 'grid'),
              'start'
            ),
            [toNamespaced('items-end-if-flex-col')]: toValue(
              toOr('flex-col'),
              'end'
            ),
            alignSelf: toOr('items-start-if-flex-row-or-grid', 'items-end-if-flex-col'),
            marginLeft: toValue(
              toOr('flex-row', 'grid'),
              'auto',
            ),
          },
          [`&:where(${absolute})`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
            right: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
          },
        },
        '.corner-b-r': {
          [`&:where(${alignable} > &)`]: {
            alignSelf: toValue(
              toOr('flex-row', 'flex-col', 'grid'),
              'end',
            ),
            justifySelf: toValue(
              toOr('grid'),
              'end',
            ),
            marginLeft: toValue(
              toOr('flex-row'),
              'auto',
            ),
            marginTop: toValue(
              toOr('flex-col'),
              'auto',
            ),
          },
          [`&:where(${absolute})`]: {
            bottom: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
            right: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
          },
        },
        '.corner-b-l': {
          [`&:where(${alignable} > &)`]: {
            [toNamespaced('items-end-if-flex-row-or-grid')]: toValue(
              toOr('flex-row', 'grid'),
              'end'
            ),
            [toNamespaced('items-start-if-flex-col')]: toValue(
              toVar('flex-col'),
              'start'
            ),
            alignSelf: toOr('items-end-if-flex-row-or-grid', 'items-start-if-flex-col'),
            marginTop: toValue(
              toOr('flex-col'),
              'auto',
            ),
          },
          [`&:where(${absolute})`]: {
            bottom: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
          },
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
          [`&:where(${alignable} > &)`]: {
            alignSelf: toValue(
              toOr('flex-col'),
              'center',
            ),
            justifySelf: toValue(
              toOr('grid'),
              'center',
            ),
            ...mx(toValue(
              toOr('flex-row'),
              'auto',
            )),
          },
          [`&:where(${absolute})`]: {
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            translate: 'var(--tw-translate-x) var(--tw-translate-y)',
          }
        },
        '.edge-r': {
          [`&:where(${alignable} > &)`]: {
            [toNamespaced('items-center-if-flex-row-or-grid')]: toValue(
              toOr('flex-row', 'grid'),
              'center'
            ),
            [toNamespaced('items-end-if-flex-col')]: toValue(
              toOr('flex-col'),
              'end'
            ),
            alignSelf: toOr('items-center-if-flex-row-or-grid', 'items-end-if-flex-col'),
            justifySelf: toValue(
              toOr('grid'),
              'end',
            ),
            marginLeft: toValue(
              toOr('flex-row'),
              'auto',
            ),
            ...my(toValue(
              toOr('flex-col'),
              'auto',
            )),
          },
          [`&:where(${absolute})`]: {
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            right: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            translate: 'var(--tw-translate-x) var(--tw-translate-y)',
          }
        },
        '.edge-b': {
          [`&:where(${alignable} > &)`]: {
            [toNamespaced('items-end-if-flex-row-or-grid')]: toValue(
              toOr('flex-row', 'grid'),
              'end'
            ),
            [toNamespaced('items-center-if-flex-col')]: toValue(
              toOr('flex-col'),
              'center'
            ),
            alignSelf: toOr('items-end-if-flex-row-or-grid', 'items-center-if-flex-col'),
            justifySelf: toValue(
              toOr('grid'),
              'center',
            ),
            ...mx(toValue(
              toOr('flex-row'),
              'auto',
            )),
            marginTop: toValue(
              toOr('flex-col'),
              'auto',
            ),
          },
          [`&:where(${absolute})`]: {
            bottom: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            ['--tw-translate-x']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            translate: 'var(--tw-translate-x) var(--tw-translate-y)',
          }
        },
        '.edge-l': {
          [`&:where(${alignable} > &)`]: {
            alignSelf: toValue(
              toOr('flex-row', 'grid'),
              'center',
            ),
            ...my(toValue(
              toOr('flex-col'),
              'auto',
            )),
          },
          [`&:where(${absolute})`]: {
            left: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '0',
            ),
            top: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '50%',
            ),
            ['--tw-translate-y']: toValue(
              toOr('absolute', 'fixed', 'sticky'),
              '-50%',
            ),
            translate: 'var(--tw-translate-x) var(--tw-translate-y)',
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


    // OVERLAP
    {
      addUtilities({
        '.overlap': {
          [`&:where(${grid} > &)`]: {
            ...apply('row-start-1 col-start-1'),
          }
        }
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


    // RING SHORTHAND
    {
      // BASE
      const variables = {
        width: `--${variableNamespace}-ring-width`,
        inset: `--tw-ring-inset`,
        color: `--tw-ring-color`,
        opacity: `--tw-ring-opacity`,
        offsetWidth: '--tw-ring-offset-width',
        offsetColor: '--tw-ring-offset-color',
      } as const

      addBase({
        '*, ::before, ::after': {
          [variables.width]: (theme(`ringWidth.DEFAULT`) || '0'),
        }
      })

            
      // VALUES
      const values: Record<any, any> = { inset: {} },
            defaults = {
              inset: `var(${variables.inset},)`,
              width: `var(${variables.width})`,
              color: `var(${variables.color})`,
            },
            widths = theme('ringWidth'),
            flattenedColors = flattenColorPalette(theme('colors'))
            
      for (const color in flattenedColors) {
        values[color] = JSON.stringify({
          ...defaults,
          color: flattenedColors[color],
        })
      }

      for (const width in widths) {
        if (width === 'DEFAULT') {
          values.DEFAULT = JSON.stringify(defaults)
          values.inset.DEFAULT = JSON.stringify({
            ...defaults,
            inset: 'inset',
          })

          for (const color in flattenedColors) {
            values[color] = JSON.stringify({
              ...defaults,
              width: theme(`ringWidth.${width}`),
              color: flattenedColors[color],
            })
            values.inset[color] = JSON.stringify({
              inset: 'inset',
              width: theme(`ringWidth.${width}`),
              color: flattenedColors[color],
            })
          }

          continue
        }

        values[width] = {
          DEFAULT: JSON.stringify({
            ...defaults,
            width: theme(`ringWidth.${width}`),
          })
        }
        values.inset[width] = {
          DEFAULT: JSON.stringify({
            ...defaults,
            inset: 'inset',
            width: theme(`ringWidth.${width}`),
          })
        }

        for (const color in flattenedColors) {
          values[width][color] = JSON.stringify({
            ...defaults,
            width: theme(`ringWidth.${width}`),
            color: flattenedColors[color],
          })
          values.inset[width][color] = JSON.stringify({
            inset: 'inset',
            width: theme(`ringWidth.${width}`),
            color: flattenedColors[color],
          })
        }
      }


      // MATCH
      matchUtilities(
        {
          ring: value => ({
            [variables.width]: value,
            ...apply(`ring-sh-[var(${variables.inset},);${value};var(${variables.color})]`),
          })
        },
        {
          values: theme('ringWidth'),
        }
      )
      
      matchUtilities(
        {
          'ring-sh': (value, { modifier: opacity }) => {
            let inset = defaults.inset,
                width = defaults.width,
                color = defaults.color
            try {
              const parsed = JSON.parse(value)
              inset = parsed.inset
              if (parsed.width !== theme('ringWidth.DEFAULT') as string) width = parsed.width
              if (parsed.color !== theme('ringColor.DEFAULT') as string) color = parsed.color
            } catch (e) {
              const values = value.split(multipleArbitraryValuesSeparator)

              switch (values.length) {
                case 3:
                  inset = values[0]
                  width = values[1]
                  color = values[2]
                  break
                case 2:
                  width = values[0]
                  color = values[1]
                  break
                case 1:
                  width = values[0]
                  break
              }
            }

            return {
              ...(
                inset === `var(${variables.inset},)`
                  ? undefined
                  : { [variables.inset]: inset }
              ),
              ...(
                color === `var(${variables.color})`
                  ? undefined
                  : majorVersion === 4
                    ? {
                      [variables.color]: `color-mix(in oklab, ${color} ${opacity * 100}%, transparent);`
                    }
                    : withAlphaVariable({
                      color,
                      property: variables.color,
                      variable: variables.opacity,
                    })
              ),
              ...(
                (
                  corePlugins?.('ringOpacity')
                  && opacity
                )
                  ? { [variables.opacity]: opacity }
                  : undefined
              ),
              ...(
                width === `var(${variables.width})`
                  ? undefined
                  : { [variables.width]: width }
              ),
              '--tw-ring-offset-shadow': `var(${variables.inset},) 0 0 0 var(${variables.offsetWidth}) var(${variables.offsetColor})`,
              '--tw-ring-shadow': `var(${variables.inset},) 0 0 0 calc(var(${variables.width}) + var(${variables.offsetWidth})) var(${variables.color}, currentColor)`,
              boxShadow: majorVersion < 4
                ? 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'
                : 'var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)',
            }
          }
        },
        {
          values: flattenColorPalette(values),
          modifiers: theme('opacity'),
        }
      )
    }
    
    
    // TRANSITION SHORTHAND
    {
      // BASE
      const variables = {
        property: `--${variableNamespace}-transition-property`,
        duration: `--${variableNamespace}-transition-duration`,
        timing: `--${variableNamespace}-transition-timing-function`,
      }

      addBase({
        '*, ::before, ::after': {
          [variables.property]: theme('transitionProperty.DEFAULT'),
          [variables.duration]: theme('transitionDuration.DEFAULT') || '0ms',
          [variables.timing]: theme('transitionTimingFunction.DEFAULT'),
        }
      })

            
      // VALUES
      const values: Record<any, any> = {},
            defaults = {
              property: `var(${variables.property})`,
              duration: `var(${variables.duration})`,
            },
            properties = theme('transitionProperty'),
            durations = theme('transitionDuration')

      for (const duration in durations) {
        values[duration] = JSON.stringify({
          ...defaults,
          duration: durations[duration],
        })
      }

      for (const property in properties) {
        if (property === 'DEFAULT') {
          values.DEFAULT = JSON.stringify(defaults)

          for (const duration in durations) {
            values[property] = JSON.stringify({
              property: properties[property],
              duration: durations[duration],
            })
          }

          continue
        }

        values[property] = {
          DEFAULT: JSON.stringify({
            ...defaults,
            property: properties[property],
          })
        }

        for (const duration in durations) {
          values[property][duration] = JSON.stringify({
            property: properties[property],
            duration: durations[duration],
          })
        }
      }

      matchUtilities(
        {
          transition: value => ({
            [variables.property]: value,
            [variables.duration]: defaults.duration,
          })
        },
        {
          values: theme('transitionProperty'),
        }
      )

      matchUtilities(
        {
          duration: value => ({
            [variables.duration]: value,
            [variables.property]: defaults.property,
          })
        },
        {
          values: theme('transitionDuration'),
        }
      )
      
      matchUtilities(
        {
          'transition-sh': (value, { modifier: timing }) => {
            let property = defaults.property,
                duration = defaults.duration

            try {
              const parsed = JSON.parse(value)
              if (parsed.property !== theme('transitionProperty.DEFAULT') as string) property = parsed.property
              if (parsed.duration !== theme('transitionDuration.DEFAULT') as string) duration = parsed.duration
            } catch (e) {
              const values = value.split(multipleArbitraryValuesSeparator)

              switch (values.length) {
                case 2:
                  property = values[0]
                  duration = values[1]
                  break
                case 1:
                  duration = values[0]
                  break
              }
            }

            return {
              ...(
                property === `var(${variables.property})`
                  ? undefined
                  : { [variables.property]: property }
              ),
              ...(
                duration === `var(${variables.duration})`
                  ? undefined
                  : { [variables.duration]: duration }
              ),
              ...(
                (timing && timing === `var(${variables.timing})`)
                  ? undefined
                  : { [variables.timing]: timing }
              ),
              transitionProperty: `var(${variables.property})`,
              transitionDuration: `var(${variables.duration})`,
              transitionTimingFunction: `var(${variables.timing})`,
            }
          }
        },
        {
          values: flattenColorPalette(values),
          modifiers: theme('transitionTimingFunction'),
        }
      )
    }
  }
})

const alignable = (() => {
        const selectors = ['flex', 'flex-row', 'flex-col', 'grid', 'grid-sh'].reduce((alignable, variant) => {
          alignable.push(
            `\.${variant}`,
            `[class$=":${variant}"]`,
            `[class^="${variant}/"]`,
            `[class*=":${variant}/"]`
          )

          if (variant === 'grid-sh') alignable.push('[class*="grid-sh-"]')

          return alignable
        }, [])

        return `:is(${selectors.join(', ')})`
      })(),
      absolute = ':is(.absolute, .fixed, .sticky, [class$=":absolute"], [class$=":fixed"], [class$=":sticky"])',
      grid = ['grid', 'grid-sh'].reduce((grid, variant) => {
        grid.push(
          `\.${variant}`,
          `[class$=":${variant}"]`,
          `[class^="${variant}/"]`,
          `[class*=":${variant}/"]`
        )

        if (variant === 'grid-sh') grid.push('[class*="grid-sh-"]')

        return grid
      }, [])

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
    .replace(dvwRE, (_, value) => `${value}dvh`)
    .replace(cqwRE, (_, value) => `${value}cqh`)
    .replace(vPercentRE, (_, value) => `${value}vh`)
    .replace(cqPercentRE, (_, value) => `${value}cqh`)
}

function toWidth(width: string) {
  return width
    .replace(vhRE, (_, value) => `${value}vw`)
    .replace(dvhRE, (_, value) => `${value}dvw`)
    .replace(cqhRE, (_, value) => `${value}cqw`)
    .replace(vPercentRE, (_, value) => `${value}vw`)
    .replace(cqPercentRE, (_, value) => `${value}cqw`)
}

const vhRE = /(\d+)vh/g
const vwRE = /(\d+)vw/g
const dvhRE = /(\d+)dvh/g
const dvwRE = /(\d+)dvw/g
const cqhRE = /(\d+)cqh/g
const cqwRE = /(\d+)cqw/g
const vPercentRE = /(\d+)v%/g
const cqPercentRE = /(\d+)cq%/g

export function createSpaceToggleFns (variableNamespace: string) {
  const toNamespaced = (variable: string) => `--${variableNamespace}-${variable}`,
        toNamespacedNot = (variable: string) => `--${variableNamespace}-not-${variable}`,
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
          [toNamespaced(variable)]: value ? ' ' : 'initial',
          [toNamespacedNot(variable)]: value ? 'initial' : ' ',
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

function createToGridValues (maxGridTemplate: number) {
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

function mx (value: string) {
  return {
    marginLeft: value,
    marginRight: value,
  }
}

function my (value: string) {
  return {
    marginTop: value,
    marginBottom: value,
  }
}

const multipleArbitraryValuesSeparator = ';' as const
