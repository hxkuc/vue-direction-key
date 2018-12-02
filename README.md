## 功能介绍
vue方向键插件，适合键盘的快捷键操作，通过键盘在input间切换，应用在后台系统开单，财务等等的快速输入和保存上，使用简单，配置方便

## 使用方法
- 安装
`npm install --save vue-direction-key`
- 使用
在入口文件中引用
```
import Direction from 'vue-direction-key'
Vue.use(Direction)
```

在input中使用
template中
```
<el-input placeholder="请输入内容" v-direction="{x: 0, y: 0}"></el-input>
<input type="text" v-direction="{x: 1, y: 0}">
```
script中
```
created: function () {
  let direction = this.$getDirection()
  direction.on('keyup', function (e, val) {
    if (e.keyCode === 39) {
      direction.next()
    }
    if (e.keyCode === 37) {
      direction.previous()
    }
    if (e.keyCode === 38) {
      direction.previousLine()
    }
    if (e.keyCode === 40) {
      direction.nextLine()
    }
  })
}
```
说明： x，y分别为x轴和y轴的坐标，事件的绑定必须在mounted之前，可以放在created中或者beforeMounted中(在mounted中绑定由于组建的渲染顺序可能会无效)


## api

在vue组件中使用this.$getDirection()获取direction对象，该对象有以下方法

- direction.next(x, y)
x,y选填，默认为当前focus的input
作用光标移动到下一个input

- direction.previous(x, y)
x,y选填，默认为当前focus的input
作用光标移动到上一个input

- direction.previousLine(x, y)
x,y选填，默认为当前focus的input
作用光标移动到上一行的input

- direction.nextLine(x, y)
x,y选填，默认为当前focus的input
作用光标移动到下一行的input

- direction.onEnd
函数，光标移动到最后一个input出发的函数
例如：
```
direction.onEnd = function () {
  console.log(111)
}
```

如果一个组件里面有多个表格或控件，可以支持自定义指令的参数，例如

```
<input type="text" v-direction:a="{x: 0, y: 0}">
<input type="text" v-direction:a="{x: 1, y: 0}">
<input type="text" v-direction:b="{x: 0, y: 0}">
<input type="text" v-direction:b="{x: 1, y: 0}">
```

```
created: function () {
  let a = this.$getDirection('a')
  a.on('keyup', function (e, val) {
    if (e.keyCode === 39) {
      a.next()
    }
    if (e.keyCode === 37) {
      a.previous()
    }
    if (e.keyCode === 38) {
      a.previousLine()
    }
    if (e.keyCode === 40) {
      a.nextLine()
    }
  })


  let b = this.$getDirection('b')
  b.on('keyup', function (e, val) {
    if (e.keyCode === 39) {
      b.next()
    }
    if (e.keyCode === 37) {
      b.previous()
    }
    if (e.keyCode === 38) {
      b.previousLine()
    }
    if (e.keyCode === 40) {
      b.nextLine()
    }
  })
}
```

## 在element表格中使用





