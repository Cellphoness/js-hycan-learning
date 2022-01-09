/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

const _ = require('lodash')
const fp = require('lodash/fp')

const delay = _.curry((sec, fn) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(fn())
        }, sec)
    })
})

const delayTenMinSec = delay(10)

delayTenMinSec(() => ['hello'])
.then(x => delayTenMinSec(() =>  [...x, 'lagou']))
.then(x => delayTenMinSec(() =>  [...x, 'I ♥ U']))
.then(fp.join(''))
.then(console.log)
