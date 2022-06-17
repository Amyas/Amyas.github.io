import install, { Vue } from "./install"
import { createMatcher } from './create-matcher'

class VueRouter {
  constructor(options = {}) {
    const routes = options.routes
    this.mode = options.mode || 'hash'

    this.matcher = createMatcher(routes || [])
  }
  init(app) {
    console.log('app init')
  }
}

VueRouter.install = install

export default VueRouter