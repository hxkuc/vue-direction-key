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

在模版文件中使用
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

在vue组件钩子中使用this.$getDirection()获取direction对象，该对象有以下方法
- direction.on(keys, fun)
   - 参数： keys： (string) 原生的事件参数如： 'keyup', 'keydown'等
     fun： 自定义函数，有两个参数function(e, val),e为event对象，val为触发的input绑定的自定义指令的值，可以通过此选项来传值进行特殊判断，例如：

   template中
   ```
   <input type="text" v-direction="{x: 1, y: 0, type: 'name'}">
   ```
   script中
   ```
   direction.on('keyup', function (e, val) {
     if (val.type === 'name') {
       console.log(111)
     }
   })
   ```
   - 作用： 给directive作用的原生input绑定事件，注意是绑定在原生的input上，例如：
   ```
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
   ```
- direction.next(x, y)
   - 参数： x,y轴的坐标，例如(1, 1)   <选填>，默认为当前focus的input坐标
   - 作用： 光标移动到下一个input

- direction.previous(x, y)
   - 参数： x,y轴的坐标，例如(1, 1)   <选填>，默认为当前focus的input坐标
   - 作用： 光标移动到上一个input

- direction.previousLine(x, y)
   - 参数： x,y轴的坐标，例如(1, 1)   <选填>，默认为当前focus的input坐标
   - 作用： 光标移动到上一行的input

- direction.nextLine(x, y)
   - 参数： x,y轴的坐标，例如(1, 1)   <选填>，默认为当前focus的input坐标
   - 作用： 光标移动到下一行的input

- direction.onEnd
   - 作用： 函数，光标移动到最后一个input出发的函数
例如：
   ```
   direction.onEnd = function () {
     console.log(111)
   }
   ```
## 在element表格中使用
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>vue-direction-key</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
  <!-- 引入组件库 -->
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <!-- 引入vue-direction-key -->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue-direction-key/direction.js"></script>
</head>

<body>
    <div id="app">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
          <template slot-scope="scope">
              <el-input v-model="scope.row.date" placeholder="请输入内容" v-direction="{x: 0, y: scope.$index}"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
          <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="请输入内容" v-direction="{x: 1, y: scope.$index}"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
          <template slot-scope="scope">
              <el-input v-model="scope.row.address" placeholder="请输入内容" v-direction="{x: 2, y: scope.$index}"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
</body>

<script type="text/javascript">
  Vue.use(Direction)
  var app = new Vue({
    el: '#app',
    data: {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    },
    created: function () {
      let direction = this.$getDirection()
      direction.on('keyup', function (e, val) {
        console.log(val)
        if (e.keyCode == 39) {
          direction.next()
        }
        if (e.keyCode == 37) {
          direction.previous()
        }
        if (e.keyCode == 38) {
          direction.previousLine()
        }
        if (e.keyCode == 40) {
          direction.nextLine()
        }
      })
    }
  })
</script>
</html>
```
## 多个组件共存
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