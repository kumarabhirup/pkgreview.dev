/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { JSHandle, Page } from 'puppeteer'

type FutureHandle = Promise<JSHandle>
type DirectJSHandle = Function

class PathEntry {
  prop: string

  args?: any[]
}

class Privates {
  root: FutureHandle

  path: PathEntry[]
}

const privates = new WeakMap<DirectJSHandle, Privates>()

function create(data: Privates): any {
  const fakeFunction: DirectJSHandle = () => {
    //
  }
  privates.set(fakeFunction, data)

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Proxy(fakeFunction, handler)
}

const handler: ProxyHandler<DirectJSHandle> = {
  get(target: Function, prop: string) {
    const data = privates.get(target)
    return create({ root: data.root, path: [...data.path, { prop }] })
  },

  apply: (target: DirectJSHandle, thisArg: any, args?: any) => {
    const { root, path } = privates.get(target)
    const { prop } = path[path.length - 1]
    const isFunction = a => typeof a === 'function'
    const indexOfCallback = args.findIndex(isFunction)
    Object.assign(path[path.length - 1], { args, indexOfCallback })

    if (indexOfCallback < 0) {
      return create({
        root,
        path: [...path.slice(0, -1), { args: args || [], prop }],
      })
    }

    ;(async () => {
      const handle = await root
      const value = await handle.executionContext().evaluate(
        (root, path) =>
          new Promise((resolve, reject) => {
            function execStep(object, entry) {
              if (entry.prop === 'then' && entry.indexOfCallback === 0) {
                resolve(object)
                return
              }
              const value = object[entry.prop]
              if (entry.args && entry.indexOfCallback >= 0) {
                entry.args[entry.indexOfCallback] = resolve
              }
              return entry.args ? value.apply(object, entry.args) : value
            }

            function execPath(subroot, subpath) {
              return subpath.length
                ? execPath(execStep(subroot, subpath[0]), subpath.slice(1))
                : subroot
            }

            execPath(root, path)
          }),
        handle,
        // @ts-ignore
        path
      )

      args[indexOfCallback](value)
    })()
  },
}

export function directJSHandle(handle: JSHandle | FutureHandle): any {
  return create({
    root: handle instanceof Promise ? handle : Promise.resolve(handle),
    path: [],
  })
}

export function getWindowHandle(page: Page): any {
  return directJSHandle(page.evaluateHandle('window'))
}
