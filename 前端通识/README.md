# 前端通识

[**-- 视频讲解 --**](https://www.bilibili.com/video/BV1av411E7qC)



## nodemon

[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=7)

功能：监控文件/目录的变化

安装：npm  i   nodemon  -D

执行

- 直接执行

```
npx nodemon ./src/index.js
```

- 脚本执行

```json
"scripts": {
  "xxx": "nodemon ./src/index.js"
}
```

```
npm run xxx
```

- 不推荐全局

```shell
nodemon ./src/index.js
```



## 对象简写

[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=8)

- 属性
- 方法(函数)

```js
let name = '景水'

/*
const teacher = {
	name: name,
	say: function () {console.log('你好')}
}
*/

const teacher = {
	name,
	say () {console.log('你好')}
}
```





## 箭头函数

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=9)**

[参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

```js
/*
  const fn = function () { console.log('i love you') }
*/

// 没有参数
const fn1 = () => { console.log('i love you') }

// 仅有一个参数
const fn2 = (x) => { console.log(x) }
const fn3 =  x  => { console.log(x) }

// 多个参数
const fn3 = (x, y) => { console.log(x + y) }

// 简写返回值
const fn4 = (x, y) => { return x + y }
const fn5 = (x, y) => x + y
const fn6 = x => x + 10

// 如果返回的是一个对象
/*
const fn7 = (name, age) => {
	return {
	  name, 
	  age
	}
}
*/ 
const fn7 = (name, age) => ({name, age})
```

**箭头函数中不绑定 this**  (也可以说没有 this)

```js
const obj = {name:'景水'}
obj.fn1 = function () { console.log(this) }  // this 代表 obj
obj.fn2 = () => { console.log(this) }        // this 代表 window (浏览器环境)
```





## call  apply  bind

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=10)**

```js
function fn (a, b, c) {
    console.log(this, a + b + c)
}

const obj = {name: '景水'}

/*  call  */
fn.call(obj, 1, 2, 3)  // fn参数逐个填写


/*  apply  */
const arr = [1, 2, 3]
fn.apply(obj, arr)     // fn参数以数组形式填写


/*  bind  */
const foo = fn.bind(obj, 1, 2, 3)  // 返回一个新函数
foo()

const fn1 = fn.bind(obj, 10)  
const fn2 = fn1.bind(null, 20)
const fn3 = fn2.bind(null, 30)
fn3()
```





## reduce

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=11)**

```js
const arr = [1, 2, 3, 4]

const res = arr.reduce((sum, item) => {
      return sum + item
}, 0)

console.log(res)
```





## 原型对象

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=12)**

```js
function Student () {

}
Student.prototype.name = '某某'
Student.prototype.sex = '女'
Student.prototype.age = 18
Student.prototype.say = function () {console.log('好好学习,天天向上')}

// 创建实例对象
const stu1 = new Student()

/*
  访问原型的方式:
  	1)构造函数.prototype
  	2)实例对象.__proto__
*/
stu1.__proto__ === Student.prototype // true

/*
  实例对象访问原型对象的属性:
  	实例对象.__proto__.属性名
  	实例对象.属性名
*/
stu1.__proto__.name
stu1.name

/*
  实例对象自己的属性
*/
function Student (a, b, c) {
	this.name = a 
  this.sex  = b
  this.age  = c
}
// 通过实参,创建实例对象,可以包含自有的属性
const stu2 = new Student('李四', '男', 23)
```





## class 语法

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=13)**

```js
class Student {
	name
	sex
	age

	constructor (a, b, c) {
      this.name = a
      this.sex = b
      this.age = c
    }
	
	say () { console.log('好好学习,天天向上') }
	
	static banji = '95期'
	static talk () { console.log('我是类的方法')}
}

const stu1 = new Student('小景', '男', 28)

/*
	类中结构 = 成员属性(变量) + 成员方法(函数)
	
	类中成员属性, 属于实例对象  访问: 对象.属性
	类中成员方法, 属于原型对象  访问: 对象.方法()
	
	static 表示静态成员, 属于类  访问:  类.属性  or  类.方法()
*/
```





## this 改变

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=14)**

```js
const obj = {
	name: '景水',
	say () {console.log(this) }
}

obj.say()

const fn = obj.say
fn()


function test (aaa) {
    aaa()
}
```
