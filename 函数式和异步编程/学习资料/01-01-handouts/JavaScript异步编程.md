# JavaScript异步编程
[TOC]

## 采用单线程模式工作的原因
最早js语言就是运行在浏览器端的语言，目的是为了实现页面上的动态交互。实现页面交互的核心就是DOM操作，这就决定了它必须使用单线程模型，否则就会出现很复杂的线程同步问题。
假设在js中有多个线程一起工作，其中一个线程修改了这个DOM元素，同时另一个线程又删除了这个元素，此时浏览器就无法明确该以哪个工作线程为准。所以为了避免线程同步的问题，从一开始，js就设计成了单线程的工作模式。

所以，js执行环境中负责执行代码的线程只有一个。

> 一个人执行一个任务，如果有多个任务，那任务需要排队，让这个人一个一个去执行。
## 单线程的优势和弊端

这种模式最大的优势就是**更安全，更简单**，缺点也很明确，就是如果中间有一个特别耗时的任务，其他的任务就要等待很长的时间，出现假死的情况。

为了解决这种问题，js有两种任务的执行模式：**同步模式（Synchronous）和异步模式（Asynchronous）**。

## 异步编程的内容概要
- 同步模式与异步模式
- 事件循环与消息队列（js如何实现异步模式）
- 异步编程的几种方式
- Promise异步方案、宏任务/微任务队列
- Generator异步方案、Async/Await语法糖

## 同步模式与异步模式
### 同步模式
**同步模式** ：指的是代码的任务依次执行，后一个任务必须等待前一个任务结束才能开始执行。程序的执行顺序和代码的编写顺序是完全一致的。在单线程模式下，大多数任务都会以同步模式执行。

```js
console.log('global begin')
function bar () {
    console.log('bar task') 
}
function foo () {
    console.log('foo task')
    bar()
}
foo()
console.log('global end')

// global begin
// foo task
// bar task
//global end

// 使用调用栈的逻辑
```
为了避免耗时函数让页面卡顿和假死，所以还有异步模式。

### 异步模式
**异步模式** 不会去等待这个任务的结束才开始下一个任务，都是开启过后就立即往后执行下一个任务。耗时函数的后续逻辑会通过回调函数的方式定义。在内部，耗时任务完成过后就会自动执行传入的回调函数。

> 异步模式对于JavaScript语言非常重要，没有它就无法同时处理大量的耗时任务。对于开发者而言。单线程下面的异步最大的难点就是代码执行的顺序混乱。

```js
console.log('global begin')
// 延时器
setTimeout(function timer1 () {
    console.log('timer1 invoke')
}, 1800)
// 延时器中又嵌套了一个延时器
setTimeout(function timer2 () {
    console.log('timer2 invoke')
    setTimeout(function inner () {
        console.log('inner invoke')
    }, 1000)
}, 1000)
console.log('global end')

// global begin
// global end
// timer2 invoke
// timer1 invoke
// inner invoke

//除了调用栈，还用到了消息队列和事件循环
```


js线程某个时刻发起了一个异步调用，它紧接着继续执行其他的任务，此时异步线程会单独执行异步任务，执行过后会将回调放到消息队列中，js主线程执行完任务过后会依次执行消息队列中的任务。**这里要强调，js是单线程的，浏览器不是单线程的，有一些API是有单独的线程去做的。**


> 这里的同步和异步不是指写代码的方式，而是运行环境提供的API是以同步或异步模式的方式工作。

### 同步模式API和异步模式API的特点
**同步模式的API的特点**就是任务执行完代码才会继续往下走，例如：console.log

**异步模式的API的特点**就是下达这个任务开启的指令之后代码就会继续执行，代码不会等待任务的结束

## 回调函数 —— 所有异步编程方案的根基
**回调函数**：由调用者定义，交给执行者执行的函数

```js
// callback就是回调函数
// 就是把函数作为参数传递，缺点是不利于阅读，执行顺序混乱。
function foo(callback) {
    setTimeout(function(){
        callback()
    }, 3000)
}

foo(function() {
    console.log('这就是一个回调函数')
    console.log('调用者定义这个函数，执行者执行这个函数')
    console.log('其实就是调用者告诉执行者异步任务结束后应该做什么')
})
```

还有其他的一些实现异步的方式，例如：**事件机制和发布订阅**。这些也都是基于回调函数之上的变体。

## Promise —— 一种更优的异步编程统一方案
### Promise概述
虽然回调函数是所有异步编程方案的根基。但是如果我们直接使用传统回调方式去完成复杂的异步流程，就会无法避免大量的回调函数嵌套。导致回调地狱的问题。

为了避免这个问题。CommonJS社区提出了Promise的规范，ES6中称为语言规范。

Promise是一个对象，用来表述一个异步任务执行之后是成功还是失败。

![Promise状态](0091F48FA21544B3B5A8715475948AE1)

### Promise基本用法

返回resolve
```js
const promise = new Promise((resolve, reject) => {
  resolve(100)
})

promise.then((value) => {
  console.log('resolved', value) // resolve 100
},(error) => {
  console.log('rejected', error)
})
```
返回reject
```js
const promise = new Promise((resolve, reject) => {
  reject(new Error('promise rejected'))
})

promise.then((value) => {
  console.log('resolved', value)
},(error) => {
  console.log('rejected', error)
  // rejected Error: promise rejected
  //  at E:\professer\lagou\Promise\promise-example.js:4:10
  //  at new Promise (<anonymous>)
})
```

即便promise中没有任何的异步操作，then方法的回调函数仍然会进入到事件队列中排队。

### Promise案例
使用Promise去封装一个ajax的案例
```js
function ajax (url) {
  return new Promise((resolve, rejects) => {
    // 创建一个XMLHttpRequest对象去发送一个请求
    const xhr = new XMLHttpRequest()
    // 先设置一下xhr对象的请求方式是GET，请求的地址就是参数传递的url
    xhr.open('GET', url)
    // 设置返回的类型是json，是HTML5的新特性
    // 我们在请求之后拿到的是json对象，而不是字符串
    xhr.responseType = 'json'
    // html5中提供的新事件,请求完成之后（readyState为4）才会执行
    xhr.onload = () => {
      if(this.status === 200) {
        // 请求成功将请求结果返回
        resolve(this.response)
      } else {
        // 请求失败，创建一个错误对象，返回错误文本
        rejects(new Error(this.statusText))
      }
    }
    // 开始执行异步请求
    xhr.send()
  })
}

ajax('/api/user.json').then((res) => {
  console.log(res)
}, (error) => {
  console.log(error)
})
```
### Promise的本质
本质上也是使用回调函数的方式去定义异步任务结束后所需要执行的任务。这里的回调函数是通过then方法传递过去的
### Promise链式调用
#### 常见误区
- 嵌套使用的方式是使用Promise最常见的误区。要使用promise的链式调用的方法尽可能保证异步任务的扁平化。

#### 链式调用的理解
- promise对象then方法，返回了全新的promise对象。可以再继续调用then方法，如果return的不是promise对象，而是一个值，那么这个值会作为resolve的值传递，如果没有值，默认是undefined
- 后面的then方法就是在为上一个then返回的Promise注册回调
- 前面then方法中回调函数的返回值会作为后面then方法回调的参数
- 如果回调中返回的是Promise，那后面then方法的回调会等待它的结束

### Promise异常处理
#### then中回调的onRejected方法
#### .catch()（推荐）
promise中如果有异常，都会调用reject方法，还可以使用.catch()

使用.catch方法更为常见，因为更加符合链式调用
```js
ajax('/api/user.json')
  .then(function onFulfilled(res) {
    console.log('onFulfilled', res)
  }).catch(function onRejected(error) {
    console.log('onRejected', error)
  })
  
// 相当于
ajax('/api/user.json')
  .then(function onFulfilled(res) {
    console.log('onFulfilled', res)
  })
  .then(undefined, function onRejected(error) {
    console.log('onRejected', error)
  })
```
.catch形式和前面then里面的第二个参数的形式，两者异常捕获的区别：

- .catch()是对上一个.then()返回的promise进行处理，不过第一个promise的报错也顺延到了catch中，而thrn的第二个参数形式，只能捕获第一个promise的报错，如果当前then的resolve函数处理中有报错是捕获不到的。

**所以.catch是给整个promise链条注册的一个失败回调。推荐使用！！！！** 

#### 全局对象上的unhandledrejection事件
还可以在全局对象上注册一个unhandledrejection事件，处理那些代码中没有被手动捕获的promise异常，当然**并不推荐使用**。

更合理的是：在代码中明确捕获每一个可能的异常，而不是丢给全局处理
```js
// 浏览器
window.addEventListener('unhandledrejection', event => {
  const { reason, promise } = event
  console.log(reason, promise)

  //reason => Promise 失败原因，一般是一个错误对象
  //promise => 出现异常的Promise对象

  event.preventDefault()
}, false)

// node
process.on('unhandledRejection', (reason, promise) => {
  console.log(reason, promise)

  //reason => Promise 失败原因，一般是一个错误对象
  //promise => 出现异常的Promise对象
})
```

## 手写Promise源码
### 一、Promise核心逻辑实现
首先分析其原理

> 1. promise就是一个类<br/>
> 在执行类的时候需要传递一个执行器进去，执行器会立即执行
> 2. Promise中有三种状态，分别为成功-fulfilled 失败-rejected 等待-pending<br/>
>   pending -> fulfilled<br/>
>   pending -> rejected<br/>
>   一旦状态确定就不可更改
> 3. resolve 和 reject函数是用来更改状态的<br/>
>resolve：fulfilled<br/>
>reject：rejected
> 4. then方法内部做的事情就是判断状态 
>如果状态是成功，调用成功回调函数<br/>
>如果状态是失败，就调用失败回调函数<br/>
>then方法是被定义在原型对象中的
> 5. then成功回调有一个参数，表示成功之后的值；then失败回调有一个参数，表示失败后的原因

```js
// myPromise.js
// 定义成常量是为了复用且代码有提示
const PENDING = 'pending' // 等待
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected' // 失败
// 定义一个构造函数
class MyPromise {
  constructor (exector) {
    // exector是一个执行器，进入会立即执行，并传入resolve和reject方法
    exector(this.resolve, this.reject)
  }

  // 实例对象的一个属性，初始为等待
  status = PENDING
  // 成功之后的值
  value = undefined
  // 失败之后的原因
  reason = undefined

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  resolve = value => {
    // 判断状态是不是等待，阻止程序向下执行
    if(this.status !== PENDING) return
    // 将状态改成成功
    this.status = FULFILLED
    // 保存成功之后的值
    this.value = value
  }

  reject = reason => {
    if(this.status !== PENDING) return
    // 将状态改为失败
    this.status = REJECTED
    // 保存失败之后的原因
    this.reason = reason
  }

  then (successCallback, failCallback) {
    //判断状态
    if(this.status === FULFILLED) {
      // 调用成功回调，并且把值返回
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      failCallback(this.reason)
    }
  }
}

module.exports = MyPromise
```
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
   resolve('success')
   reject('err')
 })

 promise.then(value => {
   console.log('resolve', value)
 }, reason => {
   console.log('reject', reason)
 })
```

### 二、在 Promise 类中加入异步逻辑

上面是没有经过异步处理的，如果有异步逻辑加进来，会有一些问题
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  // 主线程代码立即执行，setTimeout是异步代码，then会马上执行，
  // 这个时候判断promise状态，状态是pending，然而之前并没有判断等待这个状态
  setTimeout(() => {
    resolve('success')
  }, 2000); 
 })

 promise.then(value => {
   console.log('resolve', value)
 }, reason => {
   console.log('reject', reason)
 })
```
      
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }


  status = PENDING
  value = undefined
  reason = undefined
  // 定义一个成功回调参数
  successCallback = undefined
  // 定义一个失败回调参数
  failCallback = undefined

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 判断成功回调是否存在，如果存在就调用
    this.successCallback && this.successCallback(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 判断失败回调是否存在，如果存在就调用
    this.failCallback && this.failCallback(this.reason)
  }

  then (successCallback, failCallback) {
    if(this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
      // 等待
      // 因为并不知道状态，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.successCallback = successCallback
      this.failCallback = failCallback
    }
  }
}

module.exports = MyPromise
```

### 三、实现 then 方法多次调用添加多个处理函数
promise的then方法是可以被多次调用的。这里如果有三个then的调用，如果是同步回调，那么直接返回当前的值就行；如果是异步回调，那么保存的成功失败的回调，需要用不同的值保存，因为都互不相同。之前的代码需要改进。
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
 })

 promise.then(value => {
   console.log(1)
   console.log('resolve', value)
 })
 
 promise.then(value => {
  console.log(2)
  console.log('resolve', value)
})

promise.then(value => {
  console.log(3)
  console.log('resolve', value)
})
```
保存到数组中，最后统一执行
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }


  status = PENDING
  value = undefined
  reason = undefined
  // 定义一个成功回调参数，初始化一个空数组
  successCallback = []
  // 定义一个失败回调参数，初始化一个空数组
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 判断成功回调是否存在，如果存在就调用
    // 循环回调数组. 把数组前面的方法弹出来并且直接调用
    // shift方法是在数组中删除值，每执行一个就删除一个，最终变为0
    while(this.successCallback.length) this.successCallback.shift()(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 判断失败回调是否存在，如果存在就调用
    // 循环回调数组. 把数组前面的方法弹出来并且直接调用
    while(this.failCallback.length) this.failCallback.shift()(this.reason)
  }

  then (successCallback, failCallback) {
    if(this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
      // 等待
      // 将成功回调和失败回调都保存在数组中
      this.successCallback.push(successCallback)
      this.failCallback.push(failCallback)
    }
  }
}

module.exports = MyPromise
```

### 四、实现then方法的链式调用
then方法要链式调用那么就需要返回一个promise对象，
then方法的return返回值作为下一个then方法的参数

then方法还一个return一个promise对象，那么如果是一个promise对象，那么就需要判断它的状态
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
// 目前这里只处理同步的问题
    resolve('success')
})

function other () {
   return new MyPromise((resolve, reject) =>{
        resolve('other')
   })
}
promise.then(value => {
   console.log(1)
   console.log('resolve', value)
   return other()
}).then(value => {
  console.log(2)
  console.log('resolve', value)
})
```

```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }

  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length) this.successCallback.shift()(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length) this.failCallback.shift()(this.reason)
  }

  then (successCallback, failCallback) {
    // then方法返回第一个promise对象
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        // x是上一个promise回调函数的return返回值
        // 判断 x 的值时普通值还是promise对象
        // 如果是普通纸 直接调用resolve
        // 如果是promise对象 查看promise对象返回的结果
        // 再根据promise对象返回的结果 决定调用resolve还是reject
        let x = successCallback(this.value)
        resolvePromise(x, resolve, reject)
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    });
    return promise2
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是其实例对象
  if(x instanceof MyPromise) {
    // promise 对象
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise
```

### 五、then方法链式调用识别 Promise 对象自返回
如果then方法返回的是自己的promise对象，则会发生promise的嵌套，这个时候程序会报错
```js
var promise = new Promise((resolve, reject) => {
  resolve(100)
})
var p1 = promise.then(value => {
  console.log(value)
  return p1
})

// 100
// Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```
所以为了避免这种情况，我们需要改造一下then方法
```js
// myPromise.js
const { rejects } = require("assert")

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }


  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length) this.successCallback.shift()(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length) this.failCallback.shift()(this.reason)
  }

  then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        // 因为new Promise需要执行完成之后才有promise2，同步代码中没有pormise2，
        // 所以这部分代码需要异步执行
        setTimeout(() => {
          let x = successCallback(this.value)
          //需要判断then之后return的promise对象和原来的是不是一样的，
          //判断x和promise2是否相等，所以给resolvePromise中传递promise2过去
          resolvePromise(promise2, x, resolve, reject)
        }, 0);
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    });
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}

module.exports = MyPromise
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    resolve('success')
})
 
// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
let p1 = promise.then(value => {
   console.log(1)
   console.log('resolve', value)
   return p1
})
 
// 运行的时候会走reject
p1.then(value => {
  console.log(2)
  console.log('resolve', value)
}, reason => {
  console.log(3)
  console.log(reason.message)
})

// 1
// resolve success
// 3
// Chaining cycle detected for promise #<Promise>
```

### 六、捕获错误及 then 链式调用其他状态代码补充

目前我们在Promise类中没有进行任何处理，所以我们需要捕获和处理错误。

#### 1. 捕获执行器的错误
捕获执行器中的代码，如果执行器中有代码错误，那么promise的状态要弄成错误状态

```js
// myPromise.js
constructor (exector) {
    // 捕获错误，如果有错误就执行reject
    try {
        exector(this.resolve, this.reject)
    } catch (e) {
        this.reject(e)
    }
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
})
 
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
})

//2
//执行器错误
```
#### 2. then执行的时候报错捕获
```js
// myPromise.js
then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
        if(this.status === FULFILLED) {
            setTimeout(() => {
                // 如果回调中报错的话就执行reject
                try {
                    let x = successCallback(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0);
        } else if (this.status === REJECTED) {
            failCallback(this.reason)
        } else {
            this.successCallback.push(successCallback)
            this.failCallback.push(failCallback)
        }
    });
    return promise2
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    resolve('success')
    // throw new Error('执行器错误')
 })
 
// 第一个then方法中的错误要在第二个then方法中捕获到
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  throw new Error('then error')
}, reason => {
  console.log(2)
  console.log(reason.message)
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})

// 1
// resolve success
// 4
// then error
```

#### 3. 错误之后的链式调用
```js
// myPromise.js
then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
        if(this.status === FULFILLED) {
            setTimeout(() => {
                try {
                    let x = successCallback(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        // 在状态是reject的时候对返回的promise进行处理
        } else if (this.status === REJECTED) {
            setTimeout(() => {
                // 如果回调中报错的话就执行reject
                try {
                    let x = failCallback(this.reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        } else {
            this.successCallback.push(successCallback)
            this.failCallback.push(failCallback)
        }
    });
    return promise2
}
```
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
 })
 
 // 第一个then方法中的错误要在第二个then方法中捕获到
 promise.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
  return 100
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})

// 2
// 执行器错误
// 3
// 100
```
#### 4. 异步状态下链式调用
还是要处理一下如果promise里面有异步的时候，then的链式调用的问题。
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    // 捕获错误，如果有错误就执行reject
    try {
      exector(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }


  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 异步回调传值
    // 调用的时候不需要传值，因为下面push到里面的时候已经处理好了
    while(this.successCallback.length) this.successCallback.shift()()
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 异步回调传值
    // 调用的时候不需要传值，因为下面push到里面的时候已经处理好了
    while(this.failCallback.length) this.failCallback.shift()()
  }

  then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        setTimeout(() => {
          // 如果回调中报错的话就执行reject
          try {
            let x = successCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          // 如果回调中报错的话就执行reject
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        // 处理异步的成功错误情况
        this.successCallback.push(() => {
          setTimeout(() => {
            // 如果回调中报错的话就执行reject
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            // 如果回调中报错的话就执行reject
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    });
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}

module.exports = MyPromise
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  // 一个异步方法
  setTimeout(() =>{
    resolve('succ')
  },2000)
})
 
 promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  return 'aaa'
}, reason => {
  console.log(2)
  console.log(reason.message)
  return 100
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})

// 1
// resolve succ
// 3
// aaa
```

### 七、将then方法的参数变成可选参数
then方法的两个参数都是可选参数，我们可以不传参数。
下面的参数可以传递到最后进行返回
```js
var promise = new Promise((resolve, reject) => {
      resolve(100)
    })
    promise
      .then()
      .then()
      .then()
      .then(value => console.log(value))
// 在控制台最后一个then中输出了100

// 这个相当于
promise
  .then(value => value)
  .then(value => value)
  .then(value => value)
  .then(value => console.log(value))
```
所以我们修改一下then方法
```js
// myPromise.js
then (successCallback, failCallback) {
    // 这里进行判断，如果有回调就选择回调，如果没有回调就传一个函数，把参数传递
    successCallback = successCallback ? successCallback : value => value
    // 错误函数也是进行赋值，把错误信息抛出
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new Promise((resolve, reject) => {
        ...
    })
    ...
}


// 简化也可以这样写
then (successCallback = value => value, failCallback = reason => {throw reason}) {
    ···
}
```
resolve之后
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  resolve('succ')
})
 
promise.then().then().then(value => console.log(value))

// succ
```
reject之后
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  reject('err')
})
 
 promise.then().then().then(value => console.log(value), reason => console.log(reason))

// err
```

### 八、promise.all方法的实现
promise.all方法是解决异步并发问题的
```js
// 如果p1是两秒之后执行的，p2是立即执行的，那么根据正常的是p2在p1的前面。
// 如果我们在all中指定了执行顺序，那么会根据我们传递的顺序进行执行。
function p1 () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}

function p2 () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2')
    },0)
  })
}

Promise.all(['a', 'b', p1(), p2(), 'c']).then(result => {
  console.log(result)
  // ["a", "b", "p1", "p2", "c"]
})
```
分析一下：
- all方法接收一个数组，数组中可以是普通值也可以是promise对象
- 数组中值得顺序一定是我们得到的结果的顺序
- promise返回值也是一个promise对象，可以调用then方法
- 如果数组中所有值是成功的，那么then里面就是成功回调，如果有一个值是失败的，那么then里面就是失败的
- 使用all方法是用类直接调用，那么all一定是一个静态方法

```js
//myPromise.js
static all (array) {
    //  结果数组
    let result = []
    // 计数器
    let index = 0
    return new Promise((resolve, reject) => {
      let addData = (key, value) => {
        result[key] = value
        index ++
        // 如果计数器和数组长度相同，那说明所有的元素都执行完毕了，就可以输出了
        if(index === array.length) {
          resolve(result)
        }
      }
      // 对传递的数组进行遍历
      for (let i = 0; i < array.lengt; i++) {
        let current = array[i]
        if (current instanceof MyPromise) {
          // promise对象就执行then，如果是resolve就把值添加到数组中去，如果是错误就执行reject返回
          current.then(value => addData(i, value), reason => reject(reason))
        } else {
          // 普通值就加到对应的数组中去
          addData(i, array[i])
        }
      }
    })
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
function p1 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}

function p2 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2')
    },0)
  })
}

Promise.all(['a', 'b', p1(), p2(), 'c']).then(result => {
  console.log(result)
  // ["a", "b", "p1", "p2", "c"]
})
```

### 九、Promise.resolve方法的实现
- 如果参数就是一个promise对象，直接返回，如果是一个值，那么需要生成一个promise对象，把值进行返回
- 是Promise类的一个静态方法

```js
// myPromise.js
static resolve (value) {
    // 如果是promise对象，就直接返回
    if(value instanceof MyPromise) return value
    // 如果是值就返回一个promise对象，并返回值
    return new MyPromise(resolve => resolve(value))
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
function p1 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}


Promise.resolve(100).then(value => console.log(value))
Promise.resolve(p1()).then(value => console.log(value))
// 100
// 2s 之后输出 p1
```

### 十、finally 方法的实现
- 无论当前最终状态是成功还是失败，finally都会执行
- 我们可以在finally方法之后调用then方法拿到结果
- 这个函数是在原型对象上用的

```js
// myPromise.js
finally (callback) {
    // 如何拿到当前的promise的状态，使用then方法，而且不管怎样都返回callback
    // 而且then方法就是返回一个promise对象，那么我们直接返回then方法调用之后的结果即可
    // 我们需要在回调之后拿到成功的回调，所以需要把value也return
    // 失败的回调也抛出原因
    // 如果callback是一个异步的promise对象，我们还需要等待其执行完毕，所以需要用到静态方法resolve
    return this.then(value => {
      // 把callback调用之后返回的promise传递过去，并且执行promise，且在成功之后返回value
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      // 失败之后调用的then方法，然后把失败的原因返回出去。
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
function p1 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}

function p2 () {
  return new MyPromise((resolve, reject) => {
    reject('p2 reject')
  })
}

p2().finally(() => {
  console.log('finallyp2')
  return p1()
}).then(value => {
  console.log(value)
}, reason => {
  console.log(reason)
})

// finallyp2
// 两秒之后执行p2 reject
```

### 十一、catch方法的实现
- catch方法是为了捕获promise对象的所有错误回调的
- 直接调用then方法，然后成功的地方传递undefined，错误的地方传递reason
- catch方法是作用在原型对象上的方法

```js
// myPromise.js
catch (failCallback) {
    return this.then(undefined, failCallback)
}
```
```js
// promise.js
const MyPromise = require('./myPromise')

function p2 () {
  return new MyPromise((resolve, reject) => {
    reject('p2 reject')
  })
}

p2()
  .then(value => {
    console.log(value)
  })
  .catch(reason => console.log(reason))

// p2 reject
```

### Promise全部代码整合
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    try {
      exector(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }


  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length) this.successCallback.shift()()
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length) this.failCallback.shift()()
  }

  then (successCallback = value => value, failCallback = reason => {throw reason}) {
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    });
    return promise2
  }

  finally (callback) {
    // 如何拿到当前的promise的状态，使用then方法，而且不管怎样都返回callback
    // 而且then方法就是返回一个promise对象，那么我们直接返回then方法调用之后的结果即可
    // 我们需要在回调之后拿到成功的回调，所以需要把value也return
    // 失败的回调也抛出原因
    // 如果callback是一个异步的promise对象，我们还需要等待其执行完毕，所以需要用到静态方法resolve
    return this.then(value => {
      // 把callback调用之后返回的promise传递过去，并且执行promise，且在成功之后返回value
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      // 失败之后调用的then方法，然后把失败的原因返回出去。
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
  }

  catch (failCallback) {
    return this.then(undefined, failCallback)
  }

  static all (array) {
    let result = []
    let index = 0
    return new Promise((resolve, reject) => {
      let addData = (key, value) => {
        result[key] = value
        index ++
        if(index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.lengt; i++) {
        let current = array[i]
        if (current instanceof MyPromise) {
          current.then(value => addData(i, value), reason => reject(reason))
        } else {
          addData(i, array[i])
        }
      }
    })
  }

  static resolve (value) {
    if(value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}

module.exports = MyPromise
```