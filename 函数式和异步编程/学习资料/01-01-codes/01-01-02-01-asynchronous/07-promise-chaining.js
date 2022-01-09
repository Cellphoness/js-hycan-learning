// Promise 链式调用

function ajax (url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    xhr.send()
  })
}

// var promise = ajax('/api/users.json')

// var promise2 = promise.then(
//   function onFulfilled (value) {
//     console.log('onFulfilled', value)
//   },
//   function onRejected (error) {
//     console.log('onRejected', error)
//   }
// )

// console.log(promise2 === promise)

// ajax('/api/users.json')
//   .then(function (value) {
//     console.log(1111)
//     return ajax('/api/urls.json')
//   }) // => Promise
//   .then(function (value) {
//     console.log(2222)
//     console.log(value)
//     return ajax('/api/urls.json')
//   }) // => Promise
//   .then(function (value) {
//     console.log(3333)
//     return ajax(value.users)
//   }) // => Promise
//   .then(function (value) {
//     console.log(4444)
//     return value
//   }) // => Promise
//   .then(function (value) {
//     console.log(5555)
//     console.log(value)
//   })

//   const pro = new Promise(function (resolve, reject) {
//     resolve('success')
//     reject(new Error('failure'))
//     resolve('success not in')
//   })

  function b() {
      console.log(b === arguments.callee)
      console.log(arguments)

  }

//   pro.then(x => console.log('1', x))
//   .catch(e => console.log('error', e))
//   .then(x => console.log('2', x))

b()