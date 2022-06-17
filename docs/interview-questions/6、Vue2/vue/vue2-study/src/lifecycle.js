import { callHook } from './init'
import Watcher from './observer/watcher'
import { nextTick } from './utils'
import {patch} from './vdom/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) { 
    // 既有初始化又有更新
    const vm = this
    const prevVnode =  vm._vnode  // 保存当前的虚拟节点
    if(!prevVnode) { // 初次渲染
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
    }
    vm._vnode = vnode
  }
  Vue.prototype.$nextTick = nextTick
}

export function mountComponent(vm, el) {
  // 更新函数，数据变化后，再次调用此函数
  let updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render()) // 后续更新可以调用updateComponent

    // 用虚拟dom生成真是dom
  }

  callHook(vm, 'beforeMount')
  new Watcher(vm, updateComponent, ()=>{
    console.log('更新视图了')
  }, true) // 是一个渲染watcher
  callHook(vm, 'mounted')
}