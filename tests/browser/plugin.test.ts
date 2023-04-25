import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { withPlaywright } from '@baleada/prepare'

const suite = withPlaywright(
  createSuite<{
    childVariants: ['flex', 'flex-col', 'grid', 'absolute'],
    parentVariants: ['flex', 'flex-col', 'grid'],
    alignments: ['center', 'corner', 'edge'],
    verticals: ['top', 'bottom'],
    horizontals: ['left', 'right'],
    axes: ['both', 'x', 'y'],
  }>('plugin')
)

suite.before(async context => {
  const { playwright: { page } } = context

  await page.goto('http://localhost:5173')

  const meta = await page.evaluate(() => {
    return {
      childVariants: window.childVariants,
      parentVariants: window.parentVariants,
      alignments: window.alignments,
      verticals: window.verticals,
      horizontals: window.horizontals,
      axes: window.axes,
    }
  })

  Object.assign(context, meta)
})

const childVariants = ['flex', 'flex-col', 'grid', 'absolute'] as const
const parentVariants = ['flex', 'flex-col', 'grid'] as const
const alignments = ['center', 'corner', 'edge'] as const
const verticals = ['top', 'bottom'] as const
const horizontals = ['left', 'right'] as const
const axes = ['both', 'x', 'y'] as const

for (const alignment of alignments) {
  switch (alignment) {
    case 'center':
      for (const axis of axes) {
        for (const variant of childVariants) {
          const id = axis === 'both'
                    ? `${variant}-${alignment}`
                    : `${variant}-${alignment}-${axis}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            const value = await page.evaluate(([id, axis]) => {
                    const element = document.getElementById(id) as Element

                    return axis === 'both'
                      ? (
                        window.predicate.center.x(element)
                        && window.predicate.center.y(element)
                      )
                      : window.predicate.center[axis](element)
                  }, [id, axis])

            assert.ok(value)
          })
        }

        for (const variant of parentVariants) {
          const id = axis === 'both'
                    ? `${variant}-${alignment}-all`
                    : `${variant}-${alignment}-all-${axis}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            const value = await page.evaluate(([id, axis, variant]) => {
                    const element = document.getElementById(id) as Element

                    return axis === 'both'
                      ? (
                        window.predicate.centerAll[variant].x(element)
                        && window.predicate.centerAll[variant].y(element)
                      )
                      : window.predicate.centerAll[variant][axis](element)
                  }, [id, axis, variant])

            assert.ok(value)
          })
        }

        const id = axis === 'both'
          ? `responsive-${alignment}-all`
          : `responsive-${alignment}-all-${axis}`

        suite(id, async ({ playwright: { page } }) => {
          await page.waitForSelector(`#${id}`)
          await page.setViewportSize({ width: 500, height: 1000 })
          
          await (async () => {
            const value = await page.evaluate(([id, axis]) => {
              const element = document.getElementById(id) as Element

              return axis === 'both'
                ? (
                  window.predicate.centerAll.flex.x(element)
                  && window.predicate.centerAll.flex.y(element)
                )
                : window.predicate.centerAll.flex[axis](element)
            }, [id, axis])

            assert.ok(value)
          })()

          await page.setViewportSize({ width: 640, height: 1000 })
          
          await (async () => {
            const value = await page.evaluate(([id, axis]) => {
              const element = document.getElementById(id) as Element

              return axis === 'both'
                ? (
                  window.predicate.centerAll['flex-col'].x(element)
                  && window.predicate.centerAll['flex-col'].y(element)
                )
                : window.predicate.centerAll['flex-col'][axis](element)
            }, [id, axis])

            assert.ok(value, 'sm')
          })()

          await page.setViewportSize({ width: 768, height: 1000 })

          await (async () => {
            const value = await page.evaluate(([id, axis]) => {
              const element = document.getElementById(id) as Element

              return axis === 'both'
                ? (
                  window.predicate.centerAll.grid.x(element)
                  && window.predicate.centerAll.grid.y(element)
                )
                : window.predicate.centerAll.grid[axis](element)
            }, [id, axis])

            assert.ok(value, 'md')
          })()
        })
      }
      
      break
    case 'corner':
      for (const vertical of verticals) {
        for (const horizontal of horizontals) {
          for (const variant of childVariants) {
            const id = `${variant}-${alignment}-${vertical[0]}-${horizontal[0]}`

            suite(id, async ({ playwright: { page } }) => {
              await page.waitForSelector(`#${id}`)
              const value = await page.evaluate(([id, vertical, horizontal]) => {
                      const element = document.getElementById(id) as Element

                      return window.predicate.corner[vertical][horizontal](element)
                    }, [id, vertical, horizontal])

              assert.ok(value)
            })
          }

          for (const variant of parentVariants) {
            const id = `${variant}-${alignment}-all-${vertical[0]}-${horizontal[0]}`

            suite(id, async ({ playwright: { page } }) => {
              await page.waitForSelector(`#${id}`)
              const value = await page.evaluate(([id, vertical, horizontal, variant]) => {
                      const element = document.getElementById(id) as Element

                      return window.predicate.cornerAll[variant][vertical][horizontal](element)
                    }, [id, vertical, horizontal, variant])

              assert.ok(value)
            })
          }

          const id = `responsive-${alignment}-all-${vertical[0]}-${horizontal[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            await page.setViewportSize({ width: 500, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, vertical, horizontal]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.cornerAll.flex[vertical][horizontal](element)
              }, [id, vertical, horizontal])

              assert.ok(value)
            })()

            await page.setViewportSize({ width: 640, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, vertical, horizontal]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.cornerAll['flex-col'][vertical][horizontal](element)
              }, [id, vertical, horizontal])

              assert.ok(value, 'sm')
            })()

            await page.setViewportSize({ width: 768, height: 1000 })

            await (async () => {
              const value = await page.evaluate(([id, vertical, horizontal]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.cornerAll.grid[vertical][horizontal](element)
              }, [id, vertical, horizontal])

              assert.ok(value, 'md')
            })()
          })
        }
      }

      break
    case 'edge':
      for (const direction of [...verticals, ...horizontals]) {
        for (const variant of childVariants) {
          const id = `${variant}-${alignment}-${direction[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            const value = await page.evaluate(([id, direction]) => {
                    const element = document.getElementById(id) as Element

                    return window.predicate.edge[direction](element)
                  }, [id, direction])

            assert.ok(value)
          })
        }

        for (const variant of parentVariants) {
          const id = `${variant}-${alignment}-all-${direction[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            const value = await page.evaluate(([id, direction, variant]) => {
                    const element = document.getElementById(id) as Element

                    return window.predicate.edgeAll[variant][direction](element)
                  }, [id, direction, variant])

            assert.ok(value)
          })
        }

        const id = `responsive-${alignment}-all-${direction[0]}`

        suite(id, async ({ playwright: { page } }) => {
          await page.waitForSelector(`#${id}`)
          await page.setViewportSize({ width: 500, height: 1000 })
          
          await (async () => {
            const value = await page.evaluate(([id, direction]) => {
              const element = document.getElementById(id) as Element

              return window.predicate.edgeAll.flex[direction](element)
            }, [id, direction])

            assert.ok(value)
          })()

          await page.setViewportSize({ width: 640, height: 1000 })
          
          await (async () => {
            const value = await page.evaluate(([id, direction]) => {
              const element = document.getElementById(id) as Element

              return window.predicate.edgeAll['flex-col'][direction](element)
            }, [id, direction])

            assert.ok(value, 'sm')
          })()

          await page.setViewportSize({ width: 768, height: 1000 })

          await (async () => {
            const value = await page.evaluate(([id, direction]) => {
              const element = document.getElementById(id) as Element

              return window.predicate.edgeAll.grid[direction](element)
            }, [id, direction])

            assert.ok(value, 'md')
          })()
        })
      }
      
      break
  }
}

suite.run()
