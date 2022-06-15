import { mergeOptions } from "../utils"

export function initGlobalApi(Vue) {
  Vue.options = {} // 用来存放全局配置 // Vue.component Vue.filter Vue.directive 每个组件初始化时都会和options选项进行合并
  Vue.mixin = function(options) {
    this.options = mergeOptions(this.options, options)

    return this
  }
}

