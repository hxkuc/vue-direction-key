(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Direction = factory());
}(this, (function () { 'use strict';

  /*
   * @desc 弹框组件
   * 基础定义 坐标点(x, y)
   * 当前位置point，当前行列矩阵--
   * 定义方向键--上下左右键切换坐标点，enter键有两个功能--1该坐标点有值时切换下一个坐标点，2该坐标点无值时执行该坐标点自定义事件
   * 方法：next
   */

  function install(Vue) {
    Vue.directive('direction', {
      inserted: function (el, binding, vnode) {
        // console.log('inserted--' + '------' + binding.value.x + '-' + binding.value.y)
        // 获取挂载对象
        let directionObject = getDirection(vnode.context, Vue, binding.arg);
        let node = getNode(vnode);
        bindNodeArray(directionObject, node, binding.value);
        node.addEventListener('focus', function (e) {
          // 绑定指针位置
          // 获取更新后的value（绑定事件要用更新后的值，要不然会出问题）
          directionObject.nodeArray.forEach(list => {
            list.forEach(row => {
              if (row.node == node) {
                directionObject.x = row.value.x;
                directionObject.y = row.value.y;
                e.target.select();
              }
            });
          });
        });

        if (directionObject.eventList) {
          for (let i of Object.keys(directionObject.eventList)) {
            directionObject.eventList[i].forEach(fun => {
              node.addEventListener(i, function (e) {
                directionObject.nodeArray.forEach(list => {
                  list.forEach(row => {
                    if (row.node == node) {
                      fun(e, row.value);
                    }
                  });
                });
              });
            });
          }
        }
      },
      unbind: function (el, binding, vnode) {
        // console.log('unbind--' + '------' + binding.value.x + '-' + binding.value.y)
        let directionObject = getDirection(vnode.context, Vue, binding.arg);
        delete directionObject.nodeArray[binding.value.y][binding.value.x];
      },
      bind(el, binding, vnode) {
        // console.log('bind--' + '------' + binding.value.x + '-' + binding.value.y)
      },
      update(el, binding, vnode) {
        // console.log('update--old' + '---' + binding.oldValue.x + '-' + binding.oldValue.y)
        // console.log('update--' + '------' + binding.value.x + '-' + binding.value.y)
        let directionObject = getDirection(vnode.context, Vue, binding.arg);
        if (binding.oldValue.x !== binding.value.x || binding.oldValue.y !== binding.value.y) {
          delete directionObject.nodeArray[binding.oldValue.y][binding.oldValue.x];
          let node = getNode(vnode);
          Vue.nextTick(function () {
            bindNodeArray(directionObject, node, binding.value);
          });
        }
      }
    });
    Vue.prototype.$getDirection = function (keys) {
      return getDirection(this, Vue, keys)
    };
  }

  class DirectionKey {
    constructor(Vue) {
      this.nodeArray = [];
      this.x = 0;
      this.y = 0;
      this.onEnd = null;
      this.eventList = {};
      this._Vue = Vue;
    }
    next(x = this.x, y = this.y) {
      if (x < this.nodeArray[y].length - 1) {
        x++;
      } else {
        if (y < this.nodeArray.length - 1) {
          y++;
          x = 0;
        } else {
          // 超出栈，执行自定义函数
          if (typeof this.onEnd === 'function') {
            this.onEnd(this);
          }
          return false
        }
      }
      this._Vue.nextTick(() => {
        if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
          this.nodeArray[y][x].node.focus();
        } else {
          this.next(x, y);
        }
      });
    }

    previous(x = this.x, y = this.y) {
      if (x > 0) {
        x--;
      } else {
        if (y > 0) {
          y--;
          x = this.nodeArray[y].length - 1;
        } else {
          // 超出头
          return
        }
      }
      this._Vue.nextTick(() => {
        if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
          this.nodeArray[y][x].node.focus();
        } else {
          this.previous(x, y);
        }
      });
    }

    nextLine(x = this.x, y = this.y) {
      if (y < this.nodeArray.length - 1) {
        y++;
      } else {
        // 超出
        if (typeof this.onEnd === 'function') {
          this.onEnd(this);
        }
        return
      }
      this._Vue.nextTick(() => {
        if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
          this.nodeArray[y][x].node.focus();
        } else {
          this.nextLine(x, y);
        }
      });
    }

    previousLine(x = this.x, y = this.y) {
      if (y > 0) {
        y--;
      } else {
        // out
        return
      }
      this._Vue.nextTick(() => {
        if (this.nodeArray[y][x] && !this.nodeArray[y][x].node.disabled) {
          this.nodeArray[y][x].node.focus();
        } else {
          this.previousLine(x, y);
        }
      });
    }
    on(type, fun) {
      if (this.eventList[type]) {
        this.eventList[type].push(fun);
      } else {
        this.eventList[type] = [fun];
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

  // 把direction数据挂载到上下文上
  function getDirection(context, Vue, keys) {
    keys = keys || '__default__';
    if (!context.$__direction__) {
      context.$__direction__ = {};
    }
    if (!context.$__direction__[keys]) {
      context.$__direction__[keys] = new DirectionKey(Vue);
    }
    return context.$__direction__[keys]
  }
  // 向direction对象上添加元素
  function bindNodeArray(directionObject, node, value) {
    if (!directionObject.nodeArray[value.y]) {
      directionObject.nodeArray[value.y] = [];
    }
    directionObject.nodeArray[value.y][value.x] = {
      node: node,
      value: value
    };
  }

  return install;

})));
