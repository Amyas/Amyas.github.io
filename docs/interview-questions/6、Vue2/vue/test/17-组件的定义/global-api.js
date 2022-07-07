function initGlobalApi(Vue) {
  Vue.options = {};
  Vue.options._base = Vue;
  Vue.options.components = {};
  Vue.component = function (id, definition) {
    definition = this.options._base.extend(definition);
    this.options.components[id] = definition;
  };
  Vue.extend = function (options) {
    const Super = this;
    const Sub = function VueComponent(options) {
      this._init(options)
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(Super.options, options);
    return Sub;
  };
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    return this;
  };
}
