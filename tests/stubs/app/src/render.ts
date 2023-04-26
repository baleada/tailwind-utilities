export function render () {
  const { variants, positions, alignments, verticals, horizontals, axes } = window

  const detailsClassList = 'flex-col p-6'.split(' '),
        summaryClassList = 'text-sm uppercase font-bold text-indigo-600'.split(' '),
        detailsBodyClassList = 'max-w-[450px] flex-col gap-6'.split(' '),
        testClassList = 'flex-col gap-2'.split(' '),
        testParentClassList = 'relative h-36 gap-[15px] rounded bg-indigo-200'.split(' '),
        testChildClassList = 'h-6 w-6 rounded bg-indigo-600'.split(' ')

  for (const alignment of alignments) {
    const details = document.createElement('details'),
          summary = document.createElement('summary'),
          detailsBody = document.createElement('div')

    details.classList.add(...detailsClassList)
    summary.classList.add(...summaryClassList)
    detailsBody.classList.add(...detailsBodyClassList)

    summary.textContent = alignment

    // CHILD
    switch (alignment) {
      case 'center':
        for (const axis of axes) {
          for (const variant of [...variants, ...positions]) {
            if (['relative', 'sticky', 'fixed'].includes(variant)) continue
            const { id, utility } = (() =>
                    axis === 'both'
                      ? { id: `${variant}-${alignment}`, utility: alignment }
                      : { id: `${variant}-${alignment}-${axis}`, utility: `${alignment}-${axis}` }
                  )(),
                  test = document.createElement('div'),
                  label = document.createElement('code'),
                  testParent = document.createElement('div'),
                  testChild = document.createElement('div')

            label.textContent = id
            test.classList.add(...testClassList)
            testParent.classList.add(...testParentClassList)
            testChild.classList.add(...testChildClassList)

            // @ts-expect-error
            if (positions.includes(variant)) testChild.classList.add(variant)
            else testParent.classList.add(variant)
            testChild.classList.add(utility)
            testChild.id = id

            testParent.append(testChild)
            test.append(label, testParent)
            detailsBody.append(test)
          }

          const { id, utility } = (() =>
                  axis === 'both'
                    ? { id: `responsive-position-${alignment}`, utility: alignment }
                    : { id: `responsive-position-${alignment}-${axis}`, utility: `${alignment}-${axis}` }
                )(),
                test = document.createElement('div'),
                label = document.createElement('code'),
                testParent = document.createElement('div'),
                testChild = document.createElement('div')

          label.textContent = id
          test.classList.add(...testClassList)
          testParent.classList.add(...testParentClassList)
          testChild.classList.add(...testChildClassList)

          testChild.classList.add(utility, 'absolute', 'sm:relative')
          testChild.id = id

          testParent.append(testChild)
          test.append(label, testParent)
          detailsBody.append(test)
        }

        break
      case 'corner':
        for (const vertical of verticals) {
          for (const horizontal of horizontals) {
            for (const variant of [...variants, ...positions]) {
              if (['relative', 'sticky', 'fixed'].includes(variant)) continue
              const id = `${variant}-${alignment}-${vertical[0]}-${horizontal[0]}`,
                    utility = `${alignment}-${vertical[0]}-${horizontal[0]}`,
                    test = document.createElement('div'),
                    label = document.createElement('code'),
                    testParent = document.createElement('div'),
                    testChild = document.createElement('div')

              label.textContent = id
              test.classList.add(...testClassList)
              testParent.classList.add(...testParentClassList)
              testChild.classList.add(...testChildClassList)

              // @ts-expect-error
              if (positions.includes(variant)) testChild.classList.add(variant)
              else testParent.classList.add(variant)
              testChild.classList.add(utility)
              testChild.id = id

              testParent.append(testChild)
              test.append(label, testParent)
              detailsBody.append(test)
            }

            const id = `responsive-position-${alignment}-${vertical[0]}-${horizontal[0]}`,
                  utility = `${alignment}-${vertical[0]}-${horizontal[0]}`,
                  test = document.createElement('div'),
                  label = document.createElement('code'),
                  testParent = document.createElement('div'),
                  testChild = document.createElement('div')

            label.textContent = id
            test.classList.add(...testClassList)
            testParent.classList.add(...testParentClassList)
            testChild.classList.add(...testChildClassList)

            testChild.classList.add(utility, 'absolute', 'sm:relative')
            testChild.id = id

            testParent.append(testChild)
            test.append(label, testParent)
            detailsBody.append(test)
          }
        }

        break
      case 'edge':
        for (const direction of [...verticals, ...horizontals]) {
          for (const variant of [...variants, ...positions]) {
            if (['relative', 'sticky', 'fixed'].includes(variant)) continue
            const id = `${variant}-${alignment}-${direction[0]}`,
                  utility = `${alignment}-${direction[0]}`,
                  test = document.createElement('div'),
                  label = document.createElement('code'),
                  testParent = document.createElement('div'),
                  testChild = document.createElement('div')

            label.textContent = id
            test.classList.add(...testClassList)
            testParent.classList.add(...testParentClassList)
            testChild.classList.add(...testChildClassList)

            // @ts-expect-error
            if (positions.includes(variant)) testChild.classList.add(variant)
            else testParent.classList.add(variant)
            testChild.classList.add(utility)
            testChild.id = id

            testParent.append(testChild)
            test.append(label, testParent)
            detailsBody.append(test)
          }

          const id = `responsive-position-${alignment}-${direction[0]}`,
                utility = `${alignment}-${direction[0]}`,
                test = document.createElement('div'),
                label = document.createElement('code'),
                testParent = document.createElement('div'),
                testChild = document.createElement('div')

          label.textContent = id
          test.classList.add(...testClassList)
          testParent.classList.add(...testParentClassList)
          testChild.classList.add(...testChildClassList)

          testChild.classList.add(utility, 'absolute', 'sm:relative')
          testChild.id = id

          testParent.append(testChild)
          test.append(label, testParent)
          detailsBody.append(test)
        }

        break
    }

    // PARENT
    switch (alignment) {
      case 'center':
        for (const axis of axes) {
          for (const variant of variants) {
            const { id, utility } = (() =>
                    axis === 'both'
                      ? { id: `${variant}-${alignment}-all`, utility: `${alignment}-all` }
                      : { id: `${variant}-${alignment}-all-${axis}`, utility: `${alignment}-all-${axis}` }
                  )(),
                  test = document.createElement('div'),
                  label = document.createElement('code'),
                  testParent = document.createElement('div'),
                  testChildren = new Array(3).fill(0).map(() => document.createElement('div'))

            label.textContent = id
            test.classList.add(...testClassList)
            testParent.classList.add(...testParentClassList)
            testChildren.forEach(child => child.classList.add(...testChildClassList))

            testParent.classList.add(variant === 'grid' ? 'grid-cols-3' : variant)
            testParent.classList.add(utility)
            testParent.id = id

            testParent.append(...testChildren)
            test.append(label, testParent)
            detailsBody.append(test)
          }

          const { id, utility } = (() =>
                  axis === 'both'
                    ? { id: `responsive-${alignment}-all`, utility: `${alignment}-all` }
                    : { id: `responsive-${alignment}-all-${axis}`, utility: `${alignment}-all-${axis}` }
                )(),
                test = document.createElement('div'),
                label = document.createElement('code'),
                testParent = document.createElement('div'),
                testChildren = new Array(3).fill(0).map(() => document.createElement('div'))

          label.textContent = id
          test.classList.add(...testClassList)
          testParent.classList.add(...testParentClassList)
          testChildren.forEach(child => child.classList.add(...testChildClassList))

          testParent.classList.add(utility, 'flex', 'sm:flex-col', 'md:grid-cols-3',)
          testParent.id = id

          testParent.append(...testChildren)
          test.append(label, testParent)
          detailsBody.append(test)
        }

        break
      case 'corner':
        for (const vertical of verticals) {
          for (const horizontal of horizontals) {
            for (const variant of variants) {
              const id = `${variant}-${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                    utility = `${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                    test = document.createElement('div'),
                    label = document.createElement('code'),
                    testParent = document.createElement('div'),
                    testChildren = new Array(3).fill(0).map(() => document.createElement('div'))

              label.textContent = id
              test.classList.add(...testClassList)
              testParent.classList.add(...testParentClassList)
              testChildren.forEach(child => child.classList.add(...testChildClassList))

              testParent.classList.add(variant === 'grid' ? 'grid-cols-3' : variant)
              testParent.classList.add(utility)
              testParent.id = id

              testParent.append(...testChildren)
              test.append(label, testParent)
              detailsBody.append(test)
            }

            const id = `responsive-${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                  utility = `${alignment}-all-${vertical[0]}-${horizontal[0]}`,
                  test = document.createElement('div'),
                  label = document.createElement('code'),
                  testParent = document.createElement('div'),
                  testChildren = new Array(3).fill(0).map(() => document.createElement('div'))

            label.textContent = id
            test.classList.add(...testClassList)
            testParent.classList.add(...testParentClassList)
            testChildren.forEach(child => child.classList.add(...testChildClassList))

            testParent.classList.add(utility, 'flex', 'sm:flex-col', 'md:grid-cols-3',)
            testParent.id = id

            testParent.append(...testChildren)
            test.append(label, testParent)
            detailsBody.append(test)
          }
        }

        break
      case 'edge':
        for (const direction of [...verticals, ...horizontals]) {
          for (const variant of variants) {
            const id = `${variant}-${alignment}-all-${direction[0]}`,
                  utility = `${alignment}-all-${direction[0]}`,
                  test = document.createElement('div'),
                  label = document.createElement('code'),
                  testParent = document.createElement('div'),
                  testChildren = new Array(3).fill(0).map(() => document.createElement('div'))

            label.textContent = id
            test.classList.add(...testClassList)
            testParent.classList.add(...testParentClassList)
            testChildren.forEach(child => child.classList.add(...testChildClassList))

            testParent.classList.add(variant === 'grid' ? 'grid-cols-3' : variant)
            testParent.classList.add(utility)
            testParent.id = id

            testParent.append(...testChildren)
            test.append(label, testParent)
            detailsBody.append(test)
          }

          const id = `responsive-${alignment}-all-${direction[0]}`,
                utility = `${alignment}-all-${direction[0]}`,
                test = document.createElement('div'),
                label = document.createElement('code'),
                testParent = document.createElement('div'),
                testChildren = new Array(3).fill(0).map(() => document.createElement('div'))

          label.textContent = id
          test.classList.add(...testClassList)
          testParent.classList.add(...testParentClassList)
          testChildren.forEach(child => child.classList.add(...testChildClassList))

          testParent.classList.add(utility, 'flex', 'sm:flex-col', 'md:grid-cols-3',)
          testParent.id = id

          testParent.append(...testChildren)
          test.append(label, testParent)
          detailsBody.append(test)
        }

        break
    }

    details.append(summary, detailsBody)
    document.body.append(details)
  }
}
