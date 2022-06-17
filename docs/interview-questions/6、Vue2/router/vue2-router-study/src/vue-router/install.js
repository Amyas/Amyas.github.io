import RouterLink from './components/link'
import RouterView from './components/view'

export let Vue

export default function install(_Vue){
  Vue = _Vue

  // 给所有的组件统一增加$router和$route属性
  Vue.mixin({
    beforeCreate(){
      if(this.$options.router) {
        // 根组件
        this._router = this.$options.router
        this._routerRoot = this
        
        this._router.init(this)
      } else {
        // 子孙组件
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get(){

    }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get(){

    }
  })

  Vue.component('router-link', RouterLink)
  Vue.component('router-view', RouterView)
}