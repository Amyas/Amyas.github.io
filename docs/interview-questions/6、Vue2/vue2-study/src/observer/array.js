let oldArrayMethods = Array.prototype
export let arrayMethods = Object.create(Array.prototype)

const methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'reverse',
  'splice',
  'sort'
]

methods.forEach(method=>{
  arrayMethods[method] = function(...args) {
    oldArrayMethods[method].call(this, ...args)
    let inserted;
    let ob = this.__ob__

    switch(method){
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }

    if(inserted) {
      ob.observeArray(inserted)
    }

    ob.dep.notify()
  }
})