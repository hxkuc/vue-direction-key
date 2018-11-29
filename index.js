/*
 * @desc 弹框组件
 * 基础定义 坐标点(x, y)
 * 当前位置point，当前行列矩阵--
 * 定义方向键--上下左右键切换坐标点，enter键有两个功能--1该坐标点有值时切换下一个坐标点，2该坐标点无值时执行该坐标点自定义事件
 * 方法：next
 */

function install(Vue) {
  Vue.directive('keyboard', {
    inserted: function (el, binding, vnode) {
      // console.log('inserted--' + '------' + binding.value.x + '-' + binding.value.y)
      // 获取挂载对象
      let keyboard = getKeyboard(vnode.context, Vue, binding.arg)
      let node = getNode(vnode)
      bindNodeArray(keyboard, node, binding.value)
      node.addEventListener('focus', function (e) {
        // 绑定指针位置
        // 获取更新后的value（绑定事件要用更新后的值，要不然会出问题）
        keyboard.nodeArray.forEach(list => {
          list.forEach(row => {
            if (row.node == node) {
              keyboard.x = row.value.x
              keyboard.y = row.value.y
              e.target.select()
            }
          })
        })
      })

      if (keyboard.eventList) {
        for (let i of Object.keys(keyboard.eventList)) {
          keyboard.eventList[i].forEach(fun => {
            node.addEventListener(i, function (e) {
              keyboard.nodeArray.forEach(list => {
                list.forEach(row => {
                  if (row.node == node) {
                    fun(e, row.value)
                  }
                })
              })
            })
          })
        }
      }
    },
    unbind: function (el, binding, vnode) {
      // console.log('unbind--' + '------' + binding.value.x + '-' + binding.value.y)
      let keyboard = getKeyboard(vnode.context, Vue, binding.arg)
      delete keyboard.nodeArray[binding.value.y][binding.value.x]
    },
    bind(el, binding, vnode) {
      // console.log('bind--' + '------' + binding.value.x + '-' + binding.value.y)
    },
    update(el, binding, vnode) {
      // console.log('update--old' + '---' + binding.oldValue.x + '-' + binding.oldValue.y)
      // console.log('update--' + '------' + binding.value.x + '-' + binding.value.y)
      let keyboard = getKeyboard(vnode.context, Vue, binding.arg)
      if (binding.oldValue.x !== binding.value.x || binding.oldValue.y !== binding.value.y) {
        delete keyboard.nodeArray[binding.oldValue.y][binding.oldValue.x]
        let node = getNode(vnode)
        Vue.nextTick(function () {
          bindNodeArray(keyboard, node, binding.value)
        })
      }
    }
  })
  Vue.prototype.$getKeyboard = function (keys) {
    return getKeyboard(this, Vue, keys)
  }
}

class Keyboard {
  constructor(Vue) {
    this.nodeArray = []
    this.x = 0
    this.y = 0
    this.onEnd = null
    this.eventList = {}
    this._Vue = Vue
  }
  next(x = this.x, y = this.y) {
    if (x < this.nodeArray[y].length - 1) {
      x++
    } else {
      if (y < this.nodeArray.length - 1) {
        y++
        x = 0
      } else {
        // 超出栈，执行自定义函数
        if (typeof this.onEnd === 'function') {
          this.onEnd(this)
        }
        return false
      }
    }
    this._Vue.nextTick(() => {
      if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
        this.nodeArray[y][x].node.focus()
      } else {
        this.next(x, y)
      }
    })
  }

  previous(x = this.x, y = this.y) {
    if (x > 0) {
      x--
    } else {
      if (y > 0) {
        y--
        x = this.nodeArray[y].length - 1
      } else {
        // 超出头
        return
      }
    }
    this._Vue.nextTick(() => {
      if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
        this.nodeArray[y][x].node.focus()
      } else {
        this.previous(x, y)
      }
    })
  }

  nextLine(x = this.x, y = this.y) {
    if (y < this.nodeArray.length - 1) {
      y++
    } else {
      // 超出
      if (typeof this.onEnd === 'function') {
        this.onEnd(this)
      }
      return
    }
    this._Vue.nextTick(() => {
      if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
        this.nodeArray[y][x].node.focus()
      } else {
        this.nextLine(x, y)
      }
    })
  }

  previousLine(x = this.x, y = this.y) {
    if (y > 0) {
      y--
    } else {
      // out
      return
    }
    this._Vue.nextTick(() => {
      if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
        this.nodeArray[y][x].node.focus()
      } else {
        this.previousLine(x, y)
      }
    })
  }
  on(type, fun) {
    if (this.eventList[type]) {
      this.eventList[type].push(fun)
    } else {
      this.eventList[type] = [fun]
    }
  }
}

function getNode(vnode) {
  if (vnode.componentInstance) {
    return vnode.componentInstance.$refs.input
  } else {
    return vnode.elm
  }
}

// 把keyboard数据挂载到上下文上
function getKeyboard(context, Vue, keys) {
  keys = keys || '__default__'
  if (!context.$__keyboard__) {
    context.$__keyboard__ = {}
  }
  if (!context.$__keyboard__[keys]) {
    context.$__keyboard__[keys] = new Keyboard(Vue)
  }
  return context.$__keyboard__[keys]
}
// 向keyboard对象上添加元素
function bindNodeArray(keyboard, node, value) {
  if (!keyboard.nodeArray[value.y]) {
    keyboard.nodeArray[value.y] = []
  }
  keyboard.nodeArray[value.y][value.x] = {
    node: node,
    value: value
  }
}

// 获取事件
/* function bindFocus (e) {
  keyboard.nodeArray.forEach(list => {
    list.forEach(row => {
      if (row.node == node) {
        keyboard.x = row.value.x
        keyboard.y = row.value.y
        e.target.select()
      }
    })
  })
} */

export default install
