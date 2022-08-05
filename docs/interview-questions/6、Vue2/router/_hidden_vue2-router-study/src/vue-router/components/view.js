export default {
  functional: true,
  render(h, {parent, data}){
    // route变化进入这个组件的原始是，当前组件使用了$route，$route是响应式的，其实就是current
    let route = parent.$route // 获取current对象
    let depth = 0

    while(parent) {
      if(parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent
    }

    let record = route.matched[depth]
    if(!record) {
      return h() // 空
    }

    // 渲染匹配到的组件
    data.routerView = true
    return h(record.component, data)
  }
}