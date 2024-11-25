import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { withPlaywright } from '@baleada/prepare'

const suite = withPlaywright(
  createSuite('plugin')
)

suite.before(async context => {
  const { playwright: { page } } = context

  await page.goto('http://localhost:5173')
})

const variants = ['flex', 'flex-col', 'grid', 'grid-sh'] as const
const positions = ['absolute', 'fixed', 'sticky', 'relative'] as const
const alignments = ['center', 'corner', 'edge'] as const
const verticals = ['top', 'bottom'] as const
const horizontals = ['left', 'right'] as const
const axes = ['both', 'x', 'y'] as const

for (const alignment of alignments) {
  switch (alignment) {
    case 'center':
      for (const axis of axes) {
        // Basic child centering
        for (const variant of [...variants, ...positions]) {
          if (['relative', 'sticky', 'fixed'].includes(variant)) continue
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
                : window.predicate.center[axis](element) && !window.predicate.center[axis === 'x' ? 'y': 'x'](element)
            }, [id, axis])

            assert.ok(value, id)
          })
        }

        // Center child in a responsive parent
        {
          const id = axis === 'both'
            ? `responsive-${alignment}`
            : `responsive-${alignment}-${axis}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            await page.setViewportSize({ width: 500, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, axis]) => {
                const element = document.getElementById(id) as Element

                return axis === 'both'
                  ? (
                    window.predicate.center.x(element)
                    && window.predicate.center.y(element)
                  )
                  : window.predicate.center[axis](element) && !window.predicate.center[axis === 'x' ? 'y': 'x'](element)
              }, [id, axis])

              assert.ok(value, `base ${id}`)
            })()

            await page.setViewportSize({ width: 640, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, axis]) => {
                const element = document.getElementById(id) as Element

                return axis === 'both'
                  ? (
                    window.predicate.center.x(element)
                    && window.predicate.center.y(element)
                  )
                  : window.predicate.center[axis](element) && !window.predicate.center[axis === 'x' ? 'y': 'x'](element)
              }, [id, axis])

              assert.ok(value, `sm ${id}`)
            })()

            await page.setViewportSize({ width: 768, height: 1000 })

            await (async () => {
              const value = await page.evaluate(([id, axis]) => {
                const element = document.getElementById(id) as Element

                return axis === 'both'
                  ? (
                    window.predicate.center.x(element)
                    && window.predicate.center.y(element)
                  )
                  : window.predicate.center[axis](element) && !window.predicate.center[axis === 'x' ? 'y': 'x'](element)
              }, [id, axis])

              assert.ok(value, `md ${id}`)
            })()
          })
        }

        // Center child with a responsive position
        {
          const id = axis === 'both'
            ? `responsive-position-${alignment}`
            : `responsive-position-${alignment}-${axis}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            await page.setViewportSize({ width: 500, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, axis]) => {
                const element = document.getElementById(id) as Element

                return axis === 'both'
                  ? (
                    window.predicate.center.x(element)
                    && window.predicate.center.y(element)
                  )
                  : window.predicate.center[axis](element) && !window.predicate.center[axis === 'x' ? 'y': 'x'](element)
              }, [id, axis])

              assert.ok(value, `base ${id}`)
            })()

            await page.setViewportSize({ width: 640, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, axis]) => {
                const element = document.getElementById(id) as Element

                return axis === 'both'
                  ? !(
                    window.predicate.center.x(element)
                    && window.predicate.center.y(element)
                  )
                  : !window.predicate.center[axis](element)
              }, [id, axis])

              assert.ok(value, `sm ${id}`)
            })()
          })
        }

        // Basic parent centering
        for (const variant of variants) {
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
                : window.predicate.centerAll[variant][axis](element) && !window.predicate.centerAll[variant][axis === 'x' ? 'y': 'x'](element)
            }, [id, axis, variant])

            assert.ok(value, id)
          })
        }

        // Center children of a responsive parent
        {
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
                  : window.predicate.centerAll.flex[axis](element) && !window.predicate.centerAll.flex[axis === 'x' ? 'y': 'x'](element)
              }, [id, axis])

              assert.ok(value, `base ${id}`)
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
                  : window.predicate.centerAll['flex-col'][axis](element) && !window.predicate.centerAll['flex-col'][axis === 'x' ? 'y': 'x'](element)
              }, [id, axis])

              assert.ok(value, `sm ${id}`)
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
                  : window.predicate.centerAll.grid[axis](element) && !window.predicate.centerAll.grid[axis === 'x' ? 'y': 'x'](element)
              }, [id, axis])

              assert.ok(value, `md ${id}`)
            })()
          })
        }
      }
      
      break
    case 'corner':
      for (const vertical of verticals) {
        for (const horizontal of horizontals) {
          // Basic child cornering
          for (const variant of [...variants, ...positions]) {
            if (['relative', 'sticky', 'fixed'].includes(variant)) continue
            const id = `${variant}-${alignment}-${vertical[0]}-${horizontal[0]}`

            suite(id, async ({ playwright: { page } }) => {
              await page.waitForSelector(`#${id}`)
              const value = await page.evaluate(([id, vertical, horizontal]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.corner[vertical][horizontal](element)
              }, [id, vertical, horizontal])

              assert.ok(value, id)
            })
          }

          // Corner child in a responsive parent
          {
            const id = `responsive-${alignment}-${vertical[0]}-${horizontal[0]}`
  
            suite(id, async ({ playwright: { page } }) => {
              await page.waitForSelector(`#${id}`)
              await page.setViewportSize({ width: 500, height: 1000 })
              
              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element
  
                  return window.predicate.corner[vertical][horizontal](element)
                }, [id, vertical, horizontal])
  
                assert.ok(value, `base ${id}`)
              })()
  
              await page.setViewportSize({ width: 640, height: 1000 })
              
              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element
  
                  return window.predicate.corner[vertical][horizontal](element)
                }, [id, vertical, horizontal])
  
                assert.ok(value, `sm ${id}`)
              })()
  
              await page.setViewportSize({ width: 768, height: 1000 })
  
              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element
  
                  return window.predicate.corner[vertical][horizontal](element)
                }, [id, vertical, horizontal])
  
                assert.ok(value, `md ${id}`)
              })()
            })
          }

          // Corner child with a responsive position
          {
            const id = `responsive-position-${alignment}-${vertical[0]}-${horizontal[0]}`
  
            suite(id, async ({ playwright: { page } }) => {
              await page.waitForSelector(`#${id}`)
              await page.setViewportSize({ width: 500, height: 1000 })
              
              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element

                  return window.predicate.corner[vertical][horizontal](element)
                }, [id, vertical, horizontal])

                assert.ok(value, `base ${id}`)
              })()
  
              await page.setViewportSize({ width: 640, height: 1000 })
              
              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element

                  return window.predicate.corner.top.left(element)
                }, [id, vertical, horizontal])

                assert.ok(value, `sm ${id}`)
              })()
            })
          }

          // Basic parent cornering
          for (const variant of variants) {
            const id = `${variant}-${alignment}-all-${vertical[0]}-${horizontal[0]}`

            suite(id, async ({ playwright: { page } }) => {
              await page.waitForSelector(`#${id}`)
              const value = await page.evaluate(([id, vertical, horizontal, variant]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.cornerAll[variant][vertical][horizontal](element)
              }, [id, vertical, horizontal, variant])

              assert.ok(value, id)
            })
          }

          // Corner children of a responsive parent
          {
            const id = `responsive-${alignment}-all-${vertical[0]}-${horizontal[0]}`

            suite(id, async ({ playwright: { page } }) => {
              await page.waitForSelector(`#${id}`)
              await page.setViewportSize({ width: 500, height: 1000 })
              
              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element

                  return window.predicate.cornerAll.flex[vertical][horizontal](element)
                }, [id, vertical, horizontal])

                assert.ok(value, `base ${id}`)
              })()

              await page.setViewportSize({ width: 640, height: 1000 })
              
              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element

                  return window.predicate.cornerAll['flex-col'][vertical][horizontal](element)
                }, [id, vertical, horizontal])

                assert.ok(value, `sm ${id}`)
              })()

              await page.setViewportSize({ width: 768, height: 1000 })

              await (async () => {
                const value = await page.evaluate(([id, vertical, horizontal]) => {
                  const element = document.getElementById(id) as Element

                  return window.predicate.cornerAll.grid[vertical][horizontal](element)
                }, [id, vertical, horizontal])

                assert.ok(value, `md ${id}`)
              })()
            })
          }
        }
      }

      break
    case 'edge':
      for (const direction of [...verticals, ...horizontals]) {
        // Basic child edging
        for (const variant of [...variants, ...positions]) {
          if (['relative', 'sticky', 'fixed'].includes(variant)) continue
          const id = `${variant}-${alignment}-${direction[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            const value = await page.evaluate(([id, direction]) => {
              const element = document.getElementById(id) as Element

              return window.predicate.edge[direction](element)
            }, [id, direction])

            assert.ok(value, id)
          })
        }

        // Edge child in a responsive parent
        {
          const id = `responsive-${alignment}-${direction[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            await page.setViewportSize({ width: 500, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, direction]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.edge[direction](element)
              }, [id, direction])

              assert.ok(value, `base ${id}`)
            })()

            await page.setViewportSize({ width: 640, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, direction]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.edge[direction](element)
              }, [id, direction])

              assert.ok(value, `sm ${id}`)
            })()

            await page.setViewportSize({ width: 768, height: 1000 })

            await (async () => {
              const value = await page.evaluate(([id, direction]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.edge[direction](element)
              }, [id, direction])

              assert.ok(value, `md ${id}`)
            })()
          })
        }
        
        // Edge child with a responsive position
        {
          const id = `responsive-position-${alignment}-${direction[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            await page.setViewportSize({ width: 500, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, direction]) => {
                  const element = document.getElementById(id) as Element

                return window.predicate.edge[direction](element)
              }, [id, direction])

              assert.ok(value, `base ${id}`)
            })()

            await page.setViewportSize({ width: 640, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.corner.top.left(element)
              }, [id])

              assert.ok(value, `sm ${id}`)
            })()
          })
        }

        // Basic parent edging
        for (const variant of variants) {
          const id = `${variant}-${alignment}-all-${direction[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            const value = await page.evaluate(([id, direction, variant]) => {
                    const element = document.getElementById(id) as Element

                    return window.predicate.edgeAll[variant][direction](element)
                  }, [id, direction, variant])

            assert.ok(value, id)
          })
        }

        // Edge children of a responsive parent
        {
          const id = `responsive-${alignment}-all-${direction[0]}`

          suite(id, async ({ playwright: { page } }) => {
            await page.waitForSelector(`#${id}`)
            await page.setViewportSize({ width: 500, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, direction]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.edgeAll.flex[direction](element)
              }, [id, direction])

              assert.ok(value, `base ${id}`)
            })()

            await page.setViewportSize({ width: 640, height: 1000 })
            
            await (async () => {
              const value = await page.evaluate(([id, direction]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.edgeAll['flex-col'][direction](element)
              }, [id, direction])

              assert.ok(value, `sm ${id}`)
            })()

            await page.setViewportSize({ width: 768, height: 1000 })

            await (async () => {
              const value = await page.evaluate(([id, direction]) => {
                const element = document.getElementById(id) as Element

                return window.predicate.edgeAll.grid[direction](element)
              }, [id, direction])

              assert.ok(value, `md ${id}`)
            })()
          })
        }
      }
      
      break
  }
}

suite.run()
