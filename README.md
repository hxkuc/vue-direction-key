## 功能介绍
vue方向键插件，适合键盘的快捷键操作，通过键盘在input间切换，应用在后台系统开单，财务等等的快速输入和保存上，使用简单，配置方便

## 使用方法
- 安装
`npm install --save vue-direction-key`
- 使用
在入口文件中引用
```
import Keyboard from 'vue-direction-key'
Vue.use(Keyboard)
```

在input中使用
template中
```
<el-input placeholder="请输入内容" v-keyboard="{x: 0, y: 0}"></el-input>
<input type="text" v-keyboard="{x: 1, y: 0}">
```
script中
```
created: function () {
  let Keyboard = this.$getKeyboard()
  Keyboard.on('keyup', function (e, val) {
    if (e.keyCode === 39) {
      Keyboard.next()
    }
    if (e.keyCode === 37) {
      Keyboard.previous()
    }
    if (e.keyCode === 38) {
      Keyboard.previousLine()
    }
    if (e.keyCode === 40) {
      Keyboard.nextLine()
    }
  })
}
```
说明： x，y分别为x轴和y轴的坐标，事件的绑定必须在mounted之前，可以放在created中或者beforeMounted中




