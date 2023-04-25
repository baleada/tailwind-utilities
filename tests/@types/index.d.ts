export type Globals = {
  childVariants: ['flex', 'flex-col', 'grid', 'absolute'],
  parentVariants: ['flex', 'flex-col', 'grid'],
  alignments: ['center', 'corner', 'edge'],
  verticals: ['top', 'bottom'],
  horizontals: ['left', 'right'],
  axes: ['both', 'x', 'y'],
  predicate: {
    centerAll: {
      flex: {
        x: (parent: Element) => boolean,
        y: (parent: Element) => boolean,
      },
      'flex-col': {
        x: (parent: Element) => boolean,
        y: (parent: Element) => boolean,
      },
      grid: {
        x: (parent: Element) => boolean,
        y: (parent: Element) => boolean,
      },
    },
    center: {
      x: (child: Element) => boolean,
      y: (child: Element) => boolean,
    },
    cornerAll: {
      flex: {
        top: {
          left: (parent: Element) => boolean,
          right: (parent: Element) => boolean,
        },
        bottom: {
          left: (parent: Element) => boolean,
          right: (parent: Element) => boolean,
        },
      },
      'flex-col': {
        top: {
          left: (parent: Element) => boolean,
          right: (parent: Element) => boolean,
        },
        bottom: {
          left: (parent: Element) => boolean,
          right: (parent: Element) => boolean,
        },
      },
      grid: {
        top: {
          left: (parent: Element) => boolean,
          right: (parent: Element) => boolean,
        },
        bottom: {
          left: (parent: Element) => boolean,
          right: (parent: Element) => boolean,
        },
      },
    },
    corner: {
      top: {
        left: (child: Element) => boolean,
        right: (child: Element) => boolean,
      },
      bottom: {
        left: (child: Element) => boolean,
        right: (child: Element) => boolean,
      },
    },
    edgeAll: {
      flex: {
        top: (parent: Element) => boolean
        right: (parent: Element) => boolean
        bottom: (parent: Element) => boolean
        left: (parent: Element) => boolean
      },
      'flex-col': {
        top: (parent: Element) => boolean
        right: (parent: Element) => boolean
        bottom: (parent: Element) => boolean
        left: (parent: Element) => boolean
      },
      grid: {
        top: (parent: Element) => boolean
        right: (parent: Element) => boolean
        bottom: (parent: Element) => boolean
        left: (parent: Element) => boolean
      },
    }
    edge: {
      top: (child: Element) => boolean
      right: (child: Element) => boolean
      bottom: (child: Element) => boolean
      left: (child: Element) => boolean
    }
  }
}

declare global {
  interface Window extends Globals {}
}
