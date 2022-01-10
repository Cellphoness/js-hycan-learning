# 前端通识

[**-- 视频讲解 --**](https://www.bilibili.com/video/BV1av411E7qC)



## node 和 npm 版本

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=1)**

- 使用 LTS 长期支持版(稳定版)
- 大于 12	推荐 14.17.3
- npm 版本**小于** 7



## 避免中文

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=2)**

- 目录名称
- 文件名称

**中文会导致莫名其妙的问题.** 



## 留意大小写及是否有s

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=4)**

generators

plugins





## 不是内部或外部命令

[**-- 视频讲解 --**](https://www.bilibili.com/video/BV1av411E7qC?p=5)

**问题实质：** A目录下的命令文件，不能在其它目录下执行

**解决思路：** 在其它目录中执行命令时，告诉操作系统可以到A目录中去找命令文件

**具体操作：** 

设置 PATH 环境变量

当前目录下没有要执行的命令文件，操作系统会到 PATH 记录的其它路径中查找

如果找到就执行，没有找到就报错 “不是内部或外部命令”

**Windows 下**



**Linux / macOS 下**     [-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=5)

查看

```
echo $PATH
```

命令行临时修改

```
PATH=$PATH:/home/xyg/mysql/bin
echo $PATH
```

当前用户，永久有效   **（ macOS 下，可能需要 把  .bash_profile 改为 .zshrc ）**

```
#1.打开
vim ~/.bash_profile

#2.更改原行 PATH=$PATH:$HOME/bin 改为下面的
PATH=$PATH:$HOME/bin:/home/xyg/mysql/bin
#保存退出

#3.使之生效
source ~/.bash_profile
#或者
. ~/.bash_profile
```

所有用户，永久有效

```
#1.打开
vim /etc/profile

#2.编辑文件，保存退出
MYSQL_HOME=/home/xyg/mysql
export PATH=$PATH:$MYSQL_HOME/bin

#3.使生效
source ~/.bash_profile
#或者
. ~/.bash_profile
```





**配置完成后**

CMD 需要重启 CMD

VS Code 需要重启 VS Code

git bash 需要重启计算机



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



## 问题截图

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=15)**

没有截图

代码行号

错误提示

系统环境，版本

当前目录

执行的是什么命令

给出的信息量尽量多，尽量准确



## 最开始的需求

**[-- 视频讲解 --](https://www.bilibili.com/video/BV1av411E7qC?p=16)**

安卓模拟器 --->  双开微信

谷歌助手 --->  devTool

安装PCRE失败  --->  安装 nginx







## VS Code Terminal

```
// 此项已弃用
"terminal.integrated.shell.osx": null,

terminal.integrated.profiles.osx#` 中创建一个终端配置文件，并将其配置文件名称设置为 terminal.integrated.defaultProfile.osx` 中的默认值。

	

// 此项已弃用
"terminal.integrated.shell.windows": null,

terminal.integrated.profiles.windows#` 中创建一个终端配置文件，并将其配置文件名称设置为 terminal.integrated.defaultProfile.windows` 中的默认值。

	
```

参考：(https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration)。





webpack  dev   server



## web服务器

Vue 打包好的静态



### nginx

文件目录映射

端口



### node - express



### serve



### Live Server



### browsersync



### webpack-dev-server



### Vue



### React

