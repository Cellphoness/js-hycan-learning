// Promise 方式的 AJAX 请求
// 注意只用在Web的环境

// function ajax (url) {
//   return new Promise(function (resolve, reject) {
//     var xhr = new XMLHttpRequest()
//     xhr.open('GET', url)
//     xhr.responseType = 'json'
//     xhr.onload = function () {
//       if (this.status === 200) {
//         resolve(this.response)
//       } else {
//         reject(new Error(this.statusText))
//       }
//     }
//     xhr.send()
//   })
// }

// ajax('/api/foo.json').then(function (res) {
//   console.log(res)
// }, function (error) {
//   console.log(error)
// })

//在node下 使用 request
const request = require('request-promise');

// Example: 在node下 发起一个Promise的请求
request('https://wxtestapplet.gac-nio.com/community/recommend/front/v3.1.4/list?current=1&recommendListSize=0&size=15', { json: true }
).then(
  (rep) => {
    console.log(rep);
    console.log(JSON.stringify(rep));
   }
).catch(err => {
  if (err) { return console.log(err); }
});


const { Observable } = require('rxjs')

/**
 * @description: 
 * @param {*} url 请求的url
 * @return {*} Observable<Object> 请求返回的json对象的信号
 */

// 2.1
function getRequest(url) {
  /* type your code here*/
}
getRequest('https://wxtestapplet.gac-nio.com/community/recommend/front/v3.1.4/list?current=1&recommendListSize=0&size=15')
.subscribe({
  next: val => {
      console.log(val)
  },
  error: e => {
      console.log('on error', e)
  },
  complete: () => {
      console.log('on complete')
  }
})

// 2.2
var responseObject = null
setTimeout(() => {
  if (responseObject == null) {
      /* type your code here*/
  }
}, 2000)