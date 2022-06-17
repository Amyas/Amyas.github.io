function createRoute(record, location){// 创建路由
  const matched = []

  if(record) {
    while(record) {
      matched.unshift(record)
      record = record.parent
    }
  }

  return {
    ...location,
    matched
  }
}

export default class History {
  constructor(router) {
    this.router = router

    // 有一个数据来保存路径的变化
    this.current = createRoute(null, {
      path: '/'
    })
  }

  transtionTo(path, cb) {
    let record = this.router.match(path)
    this.current = createRoute(record, {
      path
    })

    // 路径变化，渲染组件，响应式原理
    // 我们需要将current属性变成响应式，这样更改current就可以渲染了
    // Vue.util.defineReactive() === defineReactive

    cb && cb()
  }

}