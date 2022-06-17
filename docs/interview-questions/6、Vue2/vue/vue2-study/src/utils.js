export function isFunction(value) {
  return typeof value === 'function'
}

export function isObject(value) {
  return typeof value === 'object' && typeof value !== null
}


const callbacks = []
function fluashCallbacks(){
  callbacks.forEach(cb=>cb())
  waiting = false
}

function timer(fluashCallbacks){
  let timerFn = ()=>{
  }

  if(Promise) {
    timerFn = ()=>Promise.resolve().then(fluashCallbacks)
  } else if (MutationObserver){
    let textNode = document.createTextNode(1)
    let observe = new MutationObserver(fluashCallbacks)
    observe.observe(textNode,{
      characterData: true
    })
    timerFn = () => {
      textNode.textContent = 3
    }
  } else if (setImmediate) {
    timerFn = ()=>{
      setImmediate(fluashCallbacks)
    }
  } else {
    timerFn = ()=>{
      setTimeout(fluashCallbacks);
    }
  }
  timerFn()
}

let waiting = false
export function nextTick(callback){
  callbacks.push(callback)

  if(!waiting) {
    timer(fluashCallbacks, 0);
    waiting = true
  }
}

const lifecycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

let strats = {} // 存放各种合并策略

function mergeHook(parentVal, childVal) {
  if(childVal) {
    if(parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

lifecycleHooks.forEach(hook=>{
  strats[hook] = mergeHook
})

strats.components = function (parentVal, childVal){
  let options = Object.create(parentVal)
  if(childVal) {
    for(let key in childVal) {
      options[key] = childVal[key]
    }
  }
  return options
}

export function mergeOptions(parent, child) {
  const options = {} // 合并后的结果
  for(let key in parent) {
    mergeFiled(key)
  }
  for(let key in child) {
    if(parent.hasOwnProperty(key)) {
      continue
    }
    mergeFiled(key)
  }

  function mergeFiled(key) {
    const parentVal = parent[key]
    const childVal = child[key]

    // 策略模式
    if(strats[key]) {
      options[key] = strats[key](parentVal, childVal)
    } else {
      if(isObject(parentVal) && isObject(childVal)) {
        options[key] = {...parentVal,...childVal}
      } else {
        options[key] = childVal || parentVal
      }
    }
  }

  return options
}

export function isReservedTag (str){
  let reservedTag = `a,div,span,p,img,button,ul,li,h1`
  return reservedTag.includes(str)
}