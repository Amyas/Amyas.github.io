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

  listen(cb) {
    this.cb = cb
  }

  transtionTo(path, cb) {
    let record = this.router.match(path)
    let route = createRoute(record, {
      path
    })
    
    if(
      (path === this.current.path) && 
      (route.matched.length === this.current.matched.length)
    ) {
      return
    }

    let queue = this.router.beforeEachHooks

    // 依次执行队列逻辑
    function runQueue(queue, iterator, cb) {
      function step(index) {
        if(index >= queue.length) return cb()
        let hook = queue[index]
        iterator(hook, ()=> step(index+1))
      }
      step(0)
    }

    const interator = (hook, next) => {
      // 此迭代函数可以拿到对应的hook
      hook(route, this.current, next)
    }

    runQueue(queue, interator, ()=>{
      // 更新路由
      this.updateRoute(route)

      cb && cb() // 此cb为hashchange
    })
  }

  updateRoute(route) {
    // 修改current替实现跳转
    this.current = route
    this.cb && this.cb(route) // 改变current 通知外部改变了
  }

}