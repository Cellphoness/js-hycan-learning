const { Observable, pipe } = require('rxjs')
// const { timeout } = require('rxjs/operators')

let result = new Observable(function subscribe (subscriber) {

  subscriber.next('1');
  
  setTimeout(() => {
    subscriber.next('2');
  }, 1000);  
  
  const intervalId = setTimeout(() => {
      subscriber.next('3');
      subscriber.complete();
  }, 3000);
  
  return function unsubscribe () {
      clearInterval(intervalId);
  }
})

result
.pipe(/* type your code here*/) // pipe timeout operator here
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