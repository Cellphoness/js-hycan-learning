// IO 函子
const { forIn } = require('lodash')
const _ = require('lodash')
const fp = require('lodash/fp')

class IO {
  static of (value) {
    return new IO(function () {
      return value
    })
  }

  constructor (fn) {
    this._value = fn
  }

  map (fn) {
    return new IO(fp.flowRight(fn, this._value))
  }
}

// 调用
let r = IO.of(process).map(p => p.execPath)
// console.log(r)
console.log(r._value())

//bind 练习
function add(x, y, z) {
    return 'sum:' + _.toString(x+y+z)
}

let arr = [1, 2, 3]

forIn(arr, x => console.log(x * 2))

var obj = {
    arr,
    io: r.map
}
console.log(obj)
console.log(JSON.stringify(obj))

console.log('\n')

// const add_1_2 = add.bind(null, 1, 2)
// //const add_1_2 = add.bind(null, 1, 2, 100, 1)
// const add1_2_100 = add_1_2.bind(null, 100)
// // console.log(add1_2_100(10))

// const re_add_1_2 = add.bind(null, 1, 1)

// console.log(re_add_1_2(10))
// console.log(add1_2_100(10))