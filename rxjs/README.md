<!--
 * @Author: Cellphoness
 * @Date: 2022-01-09 15:44:37
 * @LastEditors: Cellphoness
 * @LastEditTime: 2022-01-10 17:07:49
 * @FilePath: /learn-js/rxjs/README.md
 * @Description: 
-->
运行前需要先安装依赖：
```sh
# install deps
$ yarn # or npm i

```
### 0 以下代码的输出结果是什么，为什么？
```javascript
const { Observable } = require('rxjs')

let obs = new Observable(function subscribe (subscriber) {
  
  subscriber.next('1');

  setTimeout(() => {
    subscriber.next('2');
    subscriber.complete();
  }, 1000);
  
  const intervalId = setTimeout(() => {
      subscriber.next('3');
      subscriber.complete();
  }, 2000);

  return function unsubscribe () {
      clearInterval(intervalId);
  }
})
let observable = obs.subscribe({
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
```
如果在最后加上这一句，打印又是什么？
```javascript
setTimeout(() => { observable.unsubscribe()}, 500);
```

### 1 用rxjs的operator，限制信号超时时间为2秒，超过2秒不发出完成的信号即发出错误
打开 code1.js完成
<br />
<br />
### 2 用rxjs封装一个网络请求
打开 code2.js完成
<br />
<br />
2.1 允许依赖 request-promise，封装一个GET请求的信号 
<br />
2.2 并写一个判断，超过3秒拿不到回调就会取消订阅
<br />
<br />
### 3 错误重试
打开 code3.js完成
<br />
<br />
### 4 运用operator 4.1、合并几个信号。4.2、依次执行几个信号
打开 code4.js完成

<br />
<br />

### 5 axios实战
打开 code5.js完成