export function createRouteMap(routes, oldPathMap){
  // 如果有old path map 将routes格式化后放到old path map 中
  
  // 如果没有传递，生成一个映射表
  let pathMap = oldPathMap || {}

  routes.forEach(route=>{
    addRouteRecord(route, pathMap)
  })

  return {
    pathMap
  }
}

function addRouteRecord(route, pathMap, parent) {
  let path = parent ? `${parent.path}/${route.path}` : route.path

  // 将记录和路径关联
  let record = {
    path,
    component: route.component,
    props: route.props || {},
    parent
  }

  pathMap[path] = record
  route.children && route.children.forEach(childRoute=> {
    addRouteRecord(childRoute, pathMap, record)
  })
}