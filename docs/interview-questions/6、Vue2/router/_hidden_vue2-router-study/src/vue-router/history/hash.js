import History from "./base";

function ensureHash(){
  if(!window.location.hash) {
    window.location.hash = '/'
  }
}

function getHash(){
  return window.location.hash.slice(1)
}

export default class HashHistory extends History {
  constructor(router) {
    super(router)

    // hash路由初始化的时候需要增加一个默认的hash值 /#/
    ensureHash()
  }

  getCurrentLocation(){
    return getHash()
  }

  setUpListener(){
    window.addEventListener('hashchange', ()=>{
      // hash值变化后，再去切换组件渲染
      this.transtionTo(getHash())
    })
  }

  pushState(location){
    window.location.hash = location // 更改hash值
  }
}