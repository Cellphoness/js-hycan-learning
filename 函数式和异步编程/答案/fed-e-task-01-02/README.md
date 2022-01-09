# Part1-2 作业

( 请在当前文件直接作答 )

## 简答题

### 1. 请说出下列最终执行结果，并解释为什么?

```javascript
var a = [];
for(var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i)
  }
}
a[6]()
```

答：会输出10。因为在函数调用时候，var i 的值就是最后一次循环的值，没有保留每次遍历时的 i 值。最简单的改法就是利用es6的let块级作用域，改成var -> let。或者用闭包
```javascript
var a = [];
for(var i = 0; i < 10; i++) {
  (function(idx) {
      a[i] = function() {
        console.log(idx)
    }
  })(i)
}
a[6]()
```
或者用上面闭包的方式保存每次遍历时的 i 值。

<br />
<br />

### 2. 请说出此案列最终执行结果，并解释为什么?

```javascript
var tmp = 123;
if (true) {
  console.log(tmp);
  let tmp;
}
```
答：ReferenceError: Cannot access 'tmp' before initialization。会有一个不能访问未初始化变量的引用错误。因为let在javascript里是块级的作用域，每一个{}里面都可以定义一个同名的tmp变量，let 声明也有var的变量提升之后，进入了一个暂存性死区，如果范围这个区域的变量会报错。
　
<br />
<br />

### 3. 结合ES6语法，用最简单的方式找出数组中的最小值

```javascript
var arr = [12, 34, 32, 89, 4]
```
```javascript
arr.reduce((a, b) => b > a ? a : b, arr[0])
```
<!-- Math.min.apply(Math,arr)) -->
<br />
<br />

### 4. 请详细说明var、let、const三种声明变量的方式之间的具体差别

　
|        | var | let  | const |
|  :------:  |  :------:  |  :------:  |  :------:  |
| 语法      | var a = 10 | let a = 10 | const a = 10 |
| 提升      | 声明提升，使用undefined初始化 | 仅声明提升，未初始化  | 仅声明提升，未初始化 |
| 作用域    | 全局或函数作用域 |  块级作用域  |  块级作用域 |
| 初始化    | 可以仅声明不初始化 | 可以仅声明不初始化	 | 必须在声明时初始化  |
| 重复定义   | 可以 | 不可以 | 不可以 |
| 多次赋值   | 可以 | 可以 | 不可以  |
| 声明前访问  | 可以 |  不可以  | 不可以 |

<br />
<br />
　

### 5. 请说出下列代码最终输出结果，并解释为什么？

```javascript
var a = 10;
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a)
    })
  }
}
obj.fn()
```
答：打印20
<br />
this在普通函数中指向是调用的对象。但是这里是一个() => {}箭头函数所包裹，箭头函数没有自己的this，会寻找箭头函数外一层（离它最近的作用域）的对象，对象就是obj，所以this指向obj，所以打印20。
<br />
<br />
　

### 6. 简述Symbol类型的用途
答：Symbol 是 ES6 增加的一种数据类型，Symbol类型是为了解决属性名冲突的问题，顺带还具备模拟私有属性的功能：最主要的作用是为对象添加独一无二的属性名。
Symbol的值可以给对象一个全局唯一的key。如迭代器方法，带有 [Symbol.iterator] 做key的生成器函数的对象，让该对象具有for of的可迭代能力。
<br />
Symbol不会出现在JSON.stringify()的结果里，JSON.stringify()会忽略symbol属性名和属性值。
<br />
用 Symbol 创建的值都是唯一的不会重复，可以在调用 Symbol 时传递一个描述用来区分。如果要复用相同的 Symbol 值，可以使用 Symbol.for() 方法，传递同一个描述，for 方法内部会把传递的值转化为 string 类型的值。
<br />
能通过 Object.getOwnPropertySymbols() 方法拿到所有的Symbol属性。
<br />
<br />
　

### 7. 说说什么是浅拷贝，什么是深拷贝？

* 浅拷贝：就是拷贝对象里面的数据，但是不拷贝对象里面的子对象，拷贝的子对象和原数据的子对象引用地址相同。改变基本数据不会使原数据改变，改变子对象数据会使原数据改变。
* 深拷贝：会克隆出一个对象，数据相同，但是引用地址不同（就是拷贝对象里面的数据，而且拷贝它里面的子对象），改变基本数据和子对象都不会使原数据改变。
* https://www.jianshu.com/p/eda48da0bd16

```javascript
// es6 Object.assign 浅拷贝 不可以拷贝函数属性
// JSON.parse(JSON.stringify(a)) 深拷贝 不可以拷贝函数属性
let obj = { foo: '2333' }
var a = { name: 'wanger', obj }
// var b = Object.assign({}, a)
var b = JSON.parse(JSON.stringify(a))

a.name = '222'
obj.foo = '123'
console.log('a:', a)
console.log('b:', b)
console.log(a===b) //false

//es2017 浅拷贝可以拷贝函数
const p1 = {
    name: "name",
    func: function() {
        console.log(this.name)
    }
}
const des = Object.getOwnPropertyDescriptors(p1)
const p2 = Object.defineProperties({}, des)
p1.name = "other name"
p2.func()

```
<br />
<br />
　

### 8. 请简述TypeScript与JavaScript之间的关系？

* JavaScript：JavaScript 是动态的弱类型的语言。动态是指变量赋值类型后还可以赋予别的类型。弱类型是因为 JS 没有编译环节，错误代码只能在执行的环节才能找到，没有在执行前校验的一个过程。
* TypeScript：TypeScript 是由微软公司开发的面向对象语言，是 JavaScript 的超集，包含了 JS 的所有元素，还包含了类型系统和对 ES6 新特性的支持，通过编译后会形成 JS 代码。类型系统是包含了静态类型检查、接口、泛型、类、类型声明等。

<br />
　

### 9. 请谈谈你所认为的typescript优缺点
* 优点：增加了代码的可读性和可维护性，可以在编译阶段就发现大部分错误，让 JS 代码变得安全。增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义。大部分第三方库都有提供给 TypeScript 的类型定义文件，TypeScript 支持了 ES6 规范。
* 缺点：有一定的学习成本，需要理解接口（interfaces）、泛型（Generics）、类（classes）、枚举类型（Enums）等。适合长期的大型的项目，能够减少维护其成本。
　
<br />
<br />

### 10. 描述引用计数的工作原理和优缺点

　核心思想是设置引用数，判断当前引用数是否为0，引用关系改变的时候会修改引用数字，引用数字变为0立即回收。
* 优点：可以及时回收垃圾对象，减少程序卡顿的时间
* 缺点：需要维护表来存储引用数，如果引用数过多，则会带来一定的损耗，而且对于循环对象引用这种情况，及时没有被外部引用，也无法回收资源。

<br />
<br />

### 11. 描述标记整理算法的工作流程

1. 遍历所有对象找标记活动对象
2. 清除阶段会先执行整理，移动对象位置，将活动对象放在一起
3. 清除没有标记的对象，同时把第一次遍历所做的标记抹掉
4. 把回收的空间放到空闲列表上面，方便后续程序申请空间使用 优点： 减少了内存空间的碎片化，缺点： 不能立即回收对象

<br />
<br />

### 12.描述V8中新生代存储区垃圾回收的流程
回收过程采用复制算法+标记整理算法
1. 新生代分为 from-to 两个等大空间 32M(32 位为 16M)
2. 使用空间为 from 内存区，空闲空间为 to 内存区，当 from 空间应用一定大小会触发标记整理
3. 当发生标记整理后，复制活动对象到 to 内存区，然后 From 空间进行内存释放。
4. 如果拷贝时出现晋升，将新生代活动对象移入老生代
5. 当 To 空间的使用率达到 25%时，将新生代活动对象移入老生代
6. 当一轮 GC 执行完毕后还存活的新生代测需要晋级
7. 当一次 GC 操作后，From 和 to 需要进行置换

<br />
<br />

### 13. 描述增量标记算法在何时使用及工作原理

答： 使用时机：会穿插在程序的运行中执行。
工作原理： 对象存在直接可达和间接可达，将遍历对象标记，拆分成多个小步骤，先标记直接可达对象。间接可达的标记与程序执行交替执行，最终完成清除。
　

　