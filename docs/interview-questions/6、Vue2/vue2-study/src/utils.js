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