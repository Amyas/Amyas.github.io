import { createRouteMap } from "./create-route-map"

export function createMatcher(routes){

  let { pathMap } = createRouteMap(routes) // 创建映射表

  function match(path){
    // 帮你去path map 中找到对应的记录
    return pathMap[path]
  }


  function addRoutes(routes){
    // 将新的路由添加到pathmap 中
    createRouteMap(routes, pathMap)
  }

  return {
    match,
    addRoutes
  }
}