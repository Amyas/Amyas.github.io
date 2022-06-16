import { initGlobalApi } from './global-api/index'
import {initMixin} from './init'
import {lifecycleMixin} from './lifecycle'
import {renderMixin} from './render'
import { stateMixin } from './state'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue) // _render
lifecycleMixin(Vue) // _update
stateMixin(Vue) // watcher
initGlobalApi(Vue)

import {compileToFunction} from './compiler/index'
import {createElm, patch} from './vdom/patch'

let oldTemplate = `<div>
  <li key="a">A</li>
  <li key="b">B</li>
  <li key="c">C</li>
  <li key="d">D</li>
</div>`
let vm1 = new Vue({data:{message:'hello world'}})
const render1 = compileToFunction(oldTemplate)
const oldVnode = render1.call(vm1)
document.body.appendChild(createElm(oldVnode))

let newTemplate = `<div>
  <li key="d">D</li>
  <li key="a">A</li>
  <li key="b">B</li>
  <li key="c">C</li>
</div>`
let vm2 = new Vue({data:{message:'zf'}})
const render2 = compileToFunction(newTemplate)
const newVnode = render2.call(vm2)


setTimeout(() => {
  
// 根据信的虚拟节点更新老的节点
patch(oldVnode, newVnode)
}, 1000);




export default Vue