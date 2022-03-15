---
title: 6、Write Code
---

## 实现 ob 和 watch 方法，希望当方法传入 watch 函数时会执行一次，之后每次修改 data 上的属性时，会触发对应的 console

``` js
  const data = ob({ count: 0, foo: 'test' });

  watch(() => {
      console.log('watch-count', data.count);
  });
  watch(() => {
      console.log('watch-foo', data.foo);
  });

  data.count += 1;
  console.log('showcount', data.count);
  delete data.count;
  data.foo = 'test2';
```

## 把两个对象合并成一个JSON，其中的.需要处理成对应的层级

``` js
const data1 = {"a.b.c": 1, "a.b.d": 2}
const data2 = {"a.b.e": 3, "a.b.f": 4}
```

## 写一个发布订阅模式的on/emit/off

7.1 如果需要把订阅者执行成功和失败的方法分开，需要怎么做
7.2 如果希望失败的可追溯，找到是哪个订阅者的报错，需要怎么做
7.3 实现一下before和after方法，可以添加一些前置的和后置的订阅者
7.4 现在希望给所有的订阅者加打点上报的功能，并且提供全局的开关，需要如何设计
7.5 如果需要给某一个订阅者单独加一个打点，需要如何设计


## 实现一个简单的观察者模式(或发布-订阅模式)

``` js
/\*\*

- 目标:
- 实现一个简单的观察者模式(或发布-订阅模式)
  \*/

const shop = {
apple: 5, // 苹果 5 元
potato: 2, // 马铃薯 2 元
tomato: 3, // 西红柿 3 元
orange: 7, // 橙子 7 元
}

    /**
    * 现在我们有一个便利店的实例对象，目标是需要增加对商品价格的监听，当商品价格发生变化时，触发对应的事件。
    * 1、小明关注苹果价格变化
    * 2、小刚关注橙子价格变化
    * 3、当价格变化时，自动触发对应的事件
    */

    class Pubsub {
      constructor() {
      }

      list = {};

      // 监听方法，添加监听者，监听对象，和监听事件的方法，
      // 提示，可以将移除方法作为监听方法的返回值
      listen = (key, listener, callback) => {
      }

      // 发布消息的方法
      publish = (key, price) => {
        /** 该如何定义 发布方法？ **/
      }
    }
    // 定于一个Pubsub的实例对象
    const pubsub = new Pubsub();

    const event1 = pubsub.listen('apple', '小明', (listener, price) => {
      console.log(`${listener}关注的apple的最新价格是${price}元`);
    })

    const event2 = pubsub.listen('apple', '小强', (listener, price) => {
      console.log(`${listener}关注的apple的最新价格是${price}元`);
    })

    const event3 = pubsub.listen('orange', '小刚', (listener, price) => {
      console.log(`${listener}关注的orange的最新价格是${price}元`);
    })

    const event4 = pubsub.listen('orange', '小强', (listener, price) => {
      console.log(`${listener}关注的orange的最新价格是${price}元`);
    })

    /**
    * 应该补充怎样的逻辑能够使得我们能够监听shop中的属性值变化呢？
    * 提示：vue中双向绑定是怎么实现的呢？
    * vue2.0或vue3.0的实现方式都是可以的
    */

    /** 我们设置一个观察者方法，让 shop这个实例对象便成为可观察对象 **/
    const observable = () => {
    };

    const newShop = observable(shop);

    newShop.apple = 6;
    /** 小明关注了苹果的价格，苹果价格变更将会触发事件
    ** console.log将会输出:  小明关注的apple的最新价格是6元
    **/

    newShop.tomato = 10;
    /** 无人关注西红柿价格，不会触发事件 **/

    newShop.orange = 11;
    /** 小刚关注了橙子的价格，橙子价格变更将会触发事件
    ** console.log将会输出:  小刚关注的orange的最新价格是11元
    **/

    console.log(newShop);
    /**
    ** 输入出newShop
    **/

    console.log(newShop.apple);
    /**
    ** 输入出newShop的apple新值
    **/
```

## 写一共获取URL后的参数的方法

## 页面间同步状态一般都有哪些方案，分别的应用场景都是哪些

https://juejin.cn/post/6844903681595277320

## 如果想给一个对象上的所有方法在执行时加一些打点上报的功能，如何做

## 如果希望DOM中的一个值和js中的变量双向绑定，使用原生js可以怎么做，React和Vue分别又都是怎么做的

## 数组转成嵌套对象

``` js
["a","b","c","d"] => {a: {b: {c: {d: null}}}}
```

## a==1&&a==2有什么方式让它返回true

## 写一个EventBus，包含emit/on/off

## 判断一个对象是否是循环引用对象

## get请求是否可以传图片
