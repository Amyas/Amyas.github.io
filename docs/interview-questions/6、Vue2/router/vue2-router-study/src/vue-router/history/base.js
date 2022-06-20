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

    this.current = route
    this.cb && this.cb(route) // 改变current 通知外部改变了

    cb && cb()
  }

}