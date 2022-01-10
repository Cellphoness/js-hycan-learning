const { Observable } = require('rxjs')
const { retry } = require('rxjs/operators')
let retryCount = 0

let result = new Observable(function subscribe (subscriber) {
    
  try {
    if (retryCount == 3) {
      subscriber.next('pass!')
      subscriber.complete()
    } else {
      throw Error(`you get an observable error times: ${retryCount}`)
    }
  } catch (error) {
    subscriber.error(error)
  }
  
  retryCount += 1
  return function unsubscribe () {
    console.log('unsubscribe!')
  }
})

//重试3次 
//查看error回调
result.pipe(
 /* type your code here */ 
)
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