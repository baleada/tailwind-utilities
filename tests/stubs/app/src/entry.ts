import './index.css'
import { render } from './render'

window.childVariants = ['flex', 'flex-col', 'grid', 'absolute']
window.parentVariants = ['flex', 'flex-col', 'grid']
window.alignments = ['center', 'corner', 'edge']
window.verticals = ['top', 'bottom']
window.horizontals = ['left', 'right']
window.axes = ['both', 'x', 'y']

window.predicate = {
  // @ts-expect-error
  centerAll: { flex: {}, 'flex-col': {}, grid: {} },
  // @ts-expect-error
  center: {},
  // @ts-expect-error
  cornerAll: { flex: { top: {}, bottom: {} }, 'flex-col': { top: {}, bottom: {} }, grid: { top: {}, bottom: {} } },
  // @ts-expect-error
  corner: {},
  // @ts-expect-error
  edgeAll: { flex: {}, 'flex-col': {}, grid: {} },
  // @ts-expect-error
  edge: {},
}

{
  window.predicate.center.y = child => {
    const parent = child.parentNode as HTMLElement,
          parentRect= parent.getBoundingClientRect(),
          childRect = child.getBoundingClientRect()
  
    return childRect.top + childRect.height / 2 === parentRect.top + parentRect.height / 2
  }
  
  window.predicate.center.x = child => {
    const parent = child.parentNode as HTMLElement,
          parentRect= parent.getBoundingClientRect(),
          childRect = child.getBoundingClientRect()
  
    return childRect.left + childRect.width / 2 === parentRect.left + parentRect.width / 2
  }
}

for (
  const [vertical, horizontal] of [
    ['top', 'left'],
    ['top', 'right'],
    ['bottom', 'right'],
    ['bottom', 'left']
  ]
) {
  (
    window.predicate.corner[vertical]
    || (window.predicate.corner[vertical] = {})
  )[horizontal] = (child: HTMLElement) => {
    const parent = child.parentNode as HTMLElement,
          parentRect= parent.getBoundingClientRect(),
          childRect = child.getBoundingClientRect()

    return childRect[vertical] === parentRect[vertical]
      && childRect[horizontal] === parentRect[horizontal]
  }
}

{
  window.predicate.edge.top = child => {
    const parent = child.parentNode as HTMLElement,
          parentRect= parent.getBoundingClientRect(),
          childRect = child.getBoundingClientRect()
  
    return childRect.top === parentRect.top && window.predicate.center.x(child)
  }
  
  window.predicate.edge.right = child => {
    const parent = child.parentNode as HTMLElement,
          parentRect= parent.getBoundingClientRect(),
          childRect = child.getBoundingClientRect()
  
    return childRect.right === parentRect.right && window.predicate.center.y(child)
  }
  
  window.predicate.edge.bottom = child => {
    const parent = child.parentNode as HTMLElement,
          parentRect= parent.getBoundingClientRect(),
          childRect = child.getBoundingClientRect()
  
    return childRect.bottom === parentRect.bottom && window.predicate.center.x(child)
  }
  
  window.predicate.edge.left = child => {
    const parent = child.parentNode as HTMLElement,
          parentRect= parent.getBoundingClientRect(),
          childRect = child.getBoundingClientRect()
  
    return childRect.left === parentRect.left && window.predicate.center.y(child)
  }
}

const GAP = 15

{
  window.predicate.centerAll.flex.x = parent => {
    const children = parent.children,
          parentRect = parent.getBoundingClientRect(),
          childrenRects = [...children].map(child => child.getBoundingClientRect())
  
    return [
      childrenRects[0].left + childrenRects[0].width / 2 === parentRect.left + parentRect.width / 2 - childrenRects[0].width - GAP,
      childrenRects[1].left + childrenRects[1].width / 2 === parentRect.left + parentRect.width / 2,
      childrenRects[2].left + childrenRects[2].width / 2 === parentRect.left + parentRect.width / 2 + childrenRects[2].width + GAP,
    ].every(Boolean)
  }
  
  window.predicate.centerAll.flex.y = parent => {
    const children = parent.children,
          parentRect = parent.getBoundingClientRect(),
          childrenRects = [...children].map(child => child.getBoundingClientRect())
  
    return childrenRects.every(rect => rect.top + rect.height / 2 === parentRect.top + parentRect.height / 2)
  }
  
  window.predicate.centerAll['flex-col'].x = parent => {
    const children = parent.children,
          parentRect = parent.getBoundingClientRect(),
          childrenRects = [...children].map(child => child.getBoundingClientRect())
  
    return childrenRects.every(rect => rect.left + rect.width / 2 === parentRect.left + parentRect.width / 2)
  }
  
  window.predicate.centerAll['flex-col'].y = parent => {
    const children = parent.children,
          parentRect = parent.getBoundingClientRect(),
          childrenRects = [...children].map(child => child.getBoundingClientRect())
  
    return [
      childrenRects[0].top + childrenRects[0].height / 2 === parentRect.top + parentRect.height / 2 - childrenRects[0].height - GAP,
      childrenRects[1].top + childrenRects[1].height / 2 === parentRect.top + parentRect.height / 2,
      childrenRects[2].top + childrenRects[2].height / 2 === parentRect.top + parentRect.height / 2 + childrenRects[2].height + GAP,
    ].every(Boolean)
  }
  
  window.predicate.centerAll.grid.x = parent => {
    const children = parent.children,
          parentRect = parent.getBoundingClientRect(),
          childrenRects = [...children].map(child => child.getBoundingClientRect())
  
    return [
      childrenRects[0].left + childrenRects[0].width / 2 === parentRect.left + (parentRect.width - GAP * 2) / 3 / 2,
      childrenRects[1].left + childrenRects[1].width / 2 === parentRect.left + parentRect.width / 2,
      childrenRects[2].left + childrenRects[2].width / 2 === parentRect.right - (parentRect.width - GAP * 2) / 3 / 2,
    ].every(Boolean)
  }
  
  window.predicate.centerAll.grid.y = parent => {
    const children = parent.children,
          parentRect = parent.getBoundingClientRect(),
          childrenRects = [...children].map(child => child.getBoundingClientRect())
  
    return childrenRects.every(rect => rect.top + rect.height / 2 === parentRect.top + parentRect.height / 2)
  }  
}

window.predicate.cornerAll.flex.top.left = parent => {
  return window.predicate.corner.top.left(parent.children[0])
}

window.predicate.cornerAll.flex.top.right = parent => {
  return window.predicate.corner.top.right(parent.children[2])
}

window.predicate.cornerAll.flex.bottom.right = parent => {
  return window.predicate.corner.bottom.right(parent.children[2])
}

window.predicate.cornerAll.flex.bottom.left = parent => {
  return window.predicate.corner.bottom.left(parent.children[0])
}

window.predicate.cornerAll['flex-col'].top.left = parent => {
  return window.predicate.corner.top.left(parent.children[0])
}

window.predicate.cornerAll['flex-col'].top.right = parent => {
  return window.predicate.corner.top.right(parent.children[0])
}

window.predicate.cornerAll['flex-col'].bottom.right = parent => {
  return window.predicate.corner.bottom.right(parent.children[2])
}

window.predicate.cornerAll['flex-col'].bottom.left = parent => {
  return window.predicate.corner.bottom.left(parent.children[2])
}

window.predicate.cornerAll.grid.top.left = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].left === parentRect.left,
      childrenRects[1].left === parentRect.left + (parentRect.width - GAP * 2) / 3 + GAP,
      childrenRects[2].left === parentRect.left + (parentRect.width - GAP * 2) / 3 * 2 + GAP * 2,
    ].every(Boolean)
    && childrenRects.every(({ top }) => top === parentRect.top)
  )
}

window.predicate.cornerAll.grid.top.right = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].right === parentRect.right - (parentRect.width - GAP * 2) / 3 * 2 - GAP * 2,
      childrenRects[1].right === parentRect.right - (parentRect.width - GAP * 2) / 3 - GAP,
      childrenRects[2].right === parentRect.right,
    ].every(Boolean)
    && childrenRects.every(({ top }) => top === parentRect.top)
  )
}

window.predicate.cornerAll.grid.bottom.right = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].right === parentRect.right - (parentRect.width - GAP * 2) / 3 * 2 - GAP * 2,
      childrenRects[1].right === parentRect.right - (parentRect.width - GAP * 2) / 3 - GAP,
      childrenRects[2].right === parentRect.right,
    ].every(Boolean)
    && childrenRects.every(({ bottom }) => bottom === parentRect.bottom)
  )
}

window.predicate.cornerAll.grid.bottom.left = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].left === parentRect.left,
      childrenRects[1].left === parentRect.left + (parentRect.width - GAP * 2) / 3 + GAP,
      childrenRects[2].left === parentRect.left + (parentRect.width - GAP * 2) / 3 * 2 + GAP * 2,
    ].every(Boolean)
    && childrenRects.every(({ bottom }) => bottom === parentRect.bottom)
  )
}

window.predicate.edgeAll.flex.top = parent => {
  return window.predicate.edge.top(parent.children[1])
}

window.predicate.edgeAll.flex.right = parent => {
  return window.predicate.edge.right(parent.children[2])
}

window.predicate.edgeAll.flex.bottom = parent => {
  return window.predicate.edge.bottom(parent.children[1])
}

window.predicate.edgeAll.flex.left = parent => {
  return window.predicate.edge.left(parent.children[0])
}

window.predicate.edgeAll['flex-col'].top = parent => {
  return window.predicate.edge.top(parent.children[0])
}

window.predicate.edgeAll['flex-col'].right = parent => {
  return window.predicate.edge.right(parent.children[1])
}

window.predicate.edgeAll['flex-col'].bottom = parent => {
  return window.predicate.edge.bottom(parent.children[2])
}

window.predicate.edgeAll['flex-col'].left = parent => {
  return window.predicate.edge.left(parent.children[1])
}

window.predicate.edgeAll.grid.top = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].left + childrenRects[0].width / 2 === parentRect.left + (parentRect.width - GAP * 2) / 3 / 2,
      childrenRects[1].left + childrenRects[1].width / 2 === parentRect.left + (parentRect.width - GAP * 2) / 3 / 2 * 3 + GAP,
      childrenRects[2].left + childrenRects[2].width / 2 === parentRect.left + (parentRect.width - GAP * 2) / 3 / 2 * 5 + GAP * 2,
    ].every(Boolean)
    && childrenRects.every(({ top }) => top === parentRect.top)
  )
}

window.predicate.edgeAll.grid.right = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].right === parentRect.right - (parentRect.width - GAP * 2) / 3 * 2 - GAP * 2,
      childrenRects[1].right === parentRect.right - (parentRect.width - GAP * 2) / 3 - GAP,
      childrenRects[2].right === parentRect.right,
    ].every(Boolean)
    && childrenRects.every(({ top, height }) => top + height / 2 === parentRect.top + parentRect.height / 2)
  )
}

window.predicate.edgeAll.grid.bottom = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].left + childrenRects[0].width / 2 === parentRect.left + (parentRect.width - GAP * 2) / 3 / 2,
      childrenRects[1].left + childrenRects[1].width / 2 === parentRect.left + (parentRect.width - GAP * 2) / 3 / 2 * 3 + GAP,
      childrenRects[2].left + childrenRects[2].width / 2 === parentRect.left + (parentRect.width - GAP * 2) / 3 / 2 * 5 + GAP * 2,
    ].every(Boolean)
    && childrenRects.every(({ bottom }) => bottom === parentRect.bottom)
  )
}

window.predicate.edgeAll.grid.left = parent => {
  const children = parent.children,
        parentRect = parent.getBoundingClientRect(),
        childrenRects = [...children].map(child => child.getBoundingClientRect())

  return (
    [
      childrenRects[0].left === parentRect.left,
      childrenRects[1].left === parentRect.left + (parentRect.width - GAP * 2) / 3 + GAP,
      childrenRects[2].left === parentRect.left + (parentRect.width - GAP * 2) / 3 * 2 + GAP * 2,
    ].every(Boolean)
    && childrenRects.every(({ top, height }) => top + height / 2 === parentRect.top + parentRect.height / 2)
  )
}

render()

for (const details of document.querySelectorAll('details')) {
  details.open = true
}

// Don't purge these
// center
// center-x
// center-y
// center-all
// center-all-x
// center-all-y
// corner-t-l
// corner-t-r
// corner-b-r
// corner-b-l
// corner-all-t-l
// corner-all-t-r
// corner-all-b-r
// corner-all-b-l
// edge-t
// edge-r
// edge-b
// edge-l
// edge-all-t
// edge-all-r
// edge-all-b
// edge-all-l
