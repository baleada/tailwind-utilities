export function renderTests () {
  const { variants, positions, alignments, verticals, horizontals, axes } = window

  const detailsClassList = 'flex-col p-6'.split(' '),
        summaryClassList = 'text-sm uppercase font-bold text-indigo-600'.split(' '),
        detailsBodyClassList = 'max-w-[450px] flex-col gap-6'.split(' '),
        testClassList = 'flex-col gap-2'.split(' '),
        testParentClassList = 'relative h-36 gap-[15px] rounded bg-indigo-200'.split(' '),
        testChildClassList = 'h-6 w-6 rounded bg-indigo-600'.split(' '),
        responsiveChildTestClassList = 'flex sm:flex-col md:grid'.split(' '),
        responsiveParentTestClassList = 'flex sm:flex-col md:grid-cols-3'.split(' ')

  function create () {
    return {
      test: document.createElement('div'),
      label: document.createElement('code'),
      testParent: document.createElement('div'),
      testChild: document.createElement('div'),
      testChildren: Array.from({ length: 3 }, () => document.createElement('div')),
    }
  }

  function renderTest (
    {
      id,
      label,
      test,
      testParent,
      testChild,
      testChildren,
      detailsBody,
    }: {
      id: string,
      label: HTMLElement,
      test: HTMLElement,
      testParent: HTMLElement,
      testChild?: HTMLElement,
      testChildren?: HTMLElement[],
      detailsBody: HTMLElement,
    }
  ) {
    const narrowedChildren = testChildren || [testChild as HTMLElement]
    label.textContent = id
    test.classList.add(...testClassList)
    testParent.classList.add(...testParentClassList)
    narrowedChildren.forEach(testChild => testChild.classList.add(...testChildClassList))
    testParent.append(...narrowedChildren)
    test.append(label, testParent)
    detailsBody.append(label, test)
  }

  for (const alignment of alignments.slice().reverse()) {
    const details = document.createElement('details'),
          summary = document.createElement('summary'),
          detailsBody = document.createElement('div')

    details.classList.add(...detailsClassList)
    summary.classList.add(...summaryClassList)
    detailsBody.classList.add(...detailsBodyClassList)

    summary.textContent = `${alignment} utilities`

    // CHILD
    switch (alignment) {
      case 'center':
        for (const axis of axes) {
          // Basic child centering
          for (const variant of [...variants, ...positions]) {
            if (['relative', 'sticky', 'fixed'].includes(variant)) continue
            const { id, utility } = axis === 'both'
                    ? { id: `${variant}-${alignment}`, utility: alignment }
                    : { id: `${variant}-${alignment}-${axis}`, utility: `${alignment}-${axis}` },
                  { test, label, testParent, testChild } = create()

            // @ts-expect-error
            if (positions.includes(variant)) testChild.classList.add(variant)
            else testParent.classList.add(variant)
            testChild.classList.add(utility)
            testChild.id = id

            renderTest({ id, label, test, testParent, testChild, detailsBody })
          }

          // Center child in a responsive parent
          {
            const { id, utility } = axis === 'both'
                    ? { id: `responsive-${alignment}`, utility: alignment }
                    : { id: `responsive-${alignment}-${axis}`, utility: `${alignment}-${axis}` },
                  { test, label, testParent, testChild } = create()

            testParent.classList.add(...responsiveChildTestClassList)
            testChild.classList.add(utility)
            testChild.id = id

            renderTest({ id, label, test, testParent, testChild, detailsBody })
          }

          // Center child with a responsive position
          {
            const { id, utility } = axis === 'both'
                    ? { id: `responsive-position-${alignment}`, utility: alignment }
                    : { id: `responsive-position-${alignment}-${axis}`, utility: `${alignment}-${axis}` },
                  { test, label, testParent, testChild } = create()
  
            testChild.classList.add(utility, 'absolute', 'sm:relative')
            testChild.id = id
  
            renderTest({ id, label, test, testParent, testChild, detailsBody })
          }
        }

        break
      case 'corner':
        for (const vertical of verticals) {
          for (const horizontal of horizontals) {
            // Basic child cornering
            for (const variant of [...variants, ...positions]) {
              if (['relative', 'sticky', 'fixed'].includes(variant)) continue
              const id = `${variant}-${alignment}-${vertical[0]}-${horizontal[0]}`,
                    utility = `${alignment}-${vertical[0]}-${horizontal[0]}`,
                    { test, label, testParent, testChild } = create()

              // @ts-expect-error.value
              if (positions.includes(variant)) testChild.classList.add(variant)
              else testParent.classList.add(variant)
              testChild.classList.add(utility)
              testChild.id = id

              renderTest({ id, label, test, testParent, testChild, detailsBody })
            }

            // Corner child in a responsive parent
            {
              const id = `responsive-${alignment}-${vertical[0]}-${horizontal[0]}`,
                    utility = `${alignment}-${vertical[0]}-${horizontal[0]}`,
                    { test, label, testParent, testChild } = create()

              testParent.classList.add(...responsiveChildTestClassList)
              testChild.classList.add(utility)
              testChild.id = id

              renderTest({ id, label, test, testParent, testChild, detailsBody })
            }

            // Corner child with a responsive position
            {
              const id = `responsive-position-${alignment}-${vertical[0]}-${horizontal[0]}`,
                    utility = `${alignment}-${vertical[0]}-${horizontal[0]}`,
                    { test, label, testParent, testChild } = create()
  
              testChild.classList.add(utility, 'absolute', 'sm:relative')
              testChild.id = id
  
              renderTest({ id, label, test, testParent, testChild, detailsBody })
            }
          }
        }

        break
      case 'edge':
        for (const direction of [...verticals, ...horizontals]) {
          // Basic child edging
          for (const variant of [...variants, ...positions]) {
            if (['relative', 'sticky', 'fixed'].includes(variant)) continue
            const id = `${variant}-${alignment}-${direction[0]}`,
                  utility = `${alignment}-${direction[0]}`,
                  { test, label, testParent, testChild } = create()

            // @ts-expect-error
            if (positions.includes(variant)) testChild.classList.add(variant)
            else testParent.classList.add(variant)
            testChild.classList.add(utility)
            testChild.id = id

            renderTest({ id, label, test, testParent, testChild, detailsBody })
          }

          // Edge child in a responsive parent
          {
            const id = `responsive-${alignment}-${direction[0]}`,
                  utility = `${alignment}-${direction[0]}`,
                  { test, label, testParent, testChild } = create()
                  
            testParent.classList.add(...responsiveChildTestClassList)
            testChild.classList.add(utility)
            testChild.id = id

            renderTest({ id, label, test, testParent, testChild, detailsBody })
          }

          // Edge child with a responsive position
          {
            const id = `responsive-position-${alignment}-${direction[0]}`,
                  utility = `${alignment}-${direction[0]}`,
                  { test, label, testParent, testChild } = create()
  
            testChild.classList.add(utility, 'absolute', 'sm:relative')
            testChild.id = id
  
            renderTest({ id, label, test, testParent, testChild, detailsBody })
          }
        }

        break
    }

    // PARENT
    switch (alignment) {
      case 'center':
        for (const axis of axes) {
          // Basic parent centering
          for (const variant of variants) {
            const { id, utility } = axis === 'both'
                    ? { id: `${variant}-${alignment}-all`, utility: `${alignment}-all` }
                    : { id: `${variant}-${alignment}-all-${axis}`, utility: `${alignment}-all-${axis}` },
                  { test, label, testParent, testChildren } = create()

            testParent.classList.add(variant === 'grid' ? 'grid-cols-3' : variant)
            testParent.classList.add(utility)
            testParent.id = id

            renderTest({ id, label, test, testParent, testChildren, detailsBody })
          }

          // Center children of a responsive parent
          {
            const { id, utility } = axis === 'both'
                    ? { id: `responsive-${alignment}-all`, utility: `${alignment}-all` }
                    : { id: `responsive-${alignment}-all-${axis}`, utility: `${alignment}-all-${axis}` },
                  { test, label, testParent, testChildren } = create()
  
            testParent.classList.add(utility, ...responsiveParentTestClassList)
            testParent.id = id
  
            renderTest({ id, label, test, testParent, testChildren, detailsBody })
          }
        }

        break
      case 'corner':
        for (const vertical of verticals) {
          for (const horizontal of horizontals) {
            // Basic parent cornering
            for (const variant of variants) {
              const id = `${variant}-${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                    utility = `${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                    { test, label, testParent, testChildren } = create()

              testParent.classList.add(variant === 'grid' ? 'grid-cols-3' : variant)
              testParent.classList.add(utility)
              testParent.id = id

              renderTest({ id, label, test, testParent, testChildren, detailsBody })
            }

            // Corner children of a responsive parent
            {
              const id = `responsive-${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                    utility = `${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                    { test, label, testParent, testChildren } = create()
  
              testParent.classList.add(utility, ...responsiveParentTestClassList)
              testParent.id = id
  
              renderTest({ id, label, test, testParent, testChildren, detailsBody })
            }
          }
        }

        break
      case 'edge':
        for (const direction of [...verticals, ...horizontals]) {
          // Basic parent edging.value
          for (const variant of variants) {
            const id = `${variant}-${alignment}-all-${direction[0]}`,
                  utility = `${alignment}-all-${direction[0]}`,
                  { test, label, testParent, testChildren } = create()

            testParent.classList.add(variant === 'grid' ? 'grid-cols-3' : variant)
            testParent.classList.add(utility)
            testParent.id = id

            renderTest({ id, label, test, testParent, testChildren, detailsBody })
          }

          // Edge children of a responsive parent
          {
            const id = `responsive-${alignment}-all-${direction[0]}`,
                  utility = `${alignment}-all-${direction[0]}`,
                  { test, label, testParent, testChildren } = create()
  
            testParent.classList.add(utility, ...responsiveParentTestClassList)
            testParent.id = id
  
            renderTest({ id, label, test, testParent, testChildren, detailsBody })
          }
        }

        break
    }

    details.append(summary, detailsBody)
    document.body.prepend(details)
  }
}

function toChildLabel (utility: string, variant: string) {
  return `${utility } `
    + (window.variants.includes(variant) ? ` (${variant} parent)` : ` (${variant})`)
}

function toParentLabel (utility: string, variant: string) {
  return window.variants.includes(variant)
    ? `${variant} ${utility}`
    : `${utility} (${variant})`
}
