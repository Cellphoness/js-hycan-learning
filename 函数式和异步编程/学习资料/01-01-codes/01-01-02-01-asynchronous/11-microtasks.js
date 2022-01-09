// 微任务

console.log('global start')

// // setTimeout 的回调是 宏任务，进入回调队列排队
// setTimeout(() => {
//   console.log('setTimeout')
// }, 1)

// // Promise 的回调是 微任务，本轮调用末尾直接执行

const pro = new Promise((res, rej) => {
    setTimeout(() => {
        rej()
    }, 2)
})

// Promise.allSettled([ 
//     Promise.reject({ code: 500, msg: '服务异常' }),
//     Promise.resolve({ code: 200, list: [] }),
//     Promise.resolve({ code: 200, list: [] })
//  ])
// .then(res => {}) 返回 res [{ status: 'fulfilled', value: {...} }, { status: 'rejected', reason: { ...}}]

// pro.then(() => {
//     console.log('promise')
//   })
//   .then(() => {
//     console.log('promise 2')
//   })

// pro.then(() => {
//     console.log('promise 3')
//   })

console.log('global end')

const { Observable } = require('rxjs')

let result = new Observable(function subscribe (subscriber) {
    const intervalId = setTimeout(() => {
        subscriber.next(3);
        subscriber.complete();
    }, 1000);
    try {
        subscriber.next(1);
        subscriber.next(2);
        // throw new Error('create observable error')
    } catch (err) {
        subscriber.error(err); // delivers an error if it caught one
    }
    return function unsubscribe () {
        clearInterval(intervalId);
    }
})

let observable = result.subscribe({
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

//   setTimeout(() => {
//     observable.unsubscribe()
//   }, 1500);

