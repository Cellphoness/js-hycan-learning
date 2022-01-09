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

### 3. 结合ES6语法，用最简单的方式找出数组中的最小值

```javascript
var arr = [12, 34, 32, 89, 4]
```

<br />
<br />

### 4. 请详细说明var、let、const三种声明变量的方式之间的具体差别

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
<br />
<br />
　

### 6. 简述Symbol类型的用途

<br />
<br />
　

### 7. 说说什么是浅拷贝，什么是深拷贝？

<br />
<br />
　

### 8. 请简述TypeScript与JavaScript之间的关系？

<br />
<br />


### 9. 请谈谈你所认为的typescript优缺点

<br />
<br />
