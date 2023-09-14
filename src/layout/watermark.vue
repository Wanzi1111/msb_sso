<template>
  <div />
</template>
<script>

export default {
  name: 'Watermark',
  props: {
    // 显示的水印文本
    text: {
      type: String,
      default: ''
    },
    // 是否允许通过js或者开发者工具等途径修改水印DOM节点（水印的id，attribute属性，节点的删除）
    // true为允许，默认不允许
    inputAllowDele: {
      type: Boolean,
      default: false
    },
    // 是否在销毁组件时去除水印节点（前提是允许用户修改DOM，否则去除后会再次自动生成）
    // true会，默认不会
    inputDestroy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      markId: '_waterMark'
    }
  },
  watch: {
    // 监听传入水印文本变化
    text: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.removeMaskDiv()
        })
      }
    }
  },
  mounted() {
    // 确认DOM渲染后再执行
    this.$nextTick(() => {
      // 创建水印节点
      this.init()
      if (!this.inputAllowDele) {
        // 设置水印节点修改的DOM事件
        this.Monitor()
      }
    })
  },
  methods: {
    init() {
      if (!this.text) return
      const canvas = document.createElement('canvas')
      canvas.id = 'canvas'
      canvas.width = '230' // 单个水印的宽高
      canvas.height = '190'
      const ctx = canvas.getContext('2d')
      const markDiv = document.createElement('div')
      ctx.font = 'normal 18px Microsoft Yahei' // 设置样式
      ctx.fillStyle = 'rgb(112, 113, 114, 0.1)' // 水印字体颜色
      ctx.rotate(30 * Math.PI / 180) // 水印偏转角度
      ctx.fillText(this.text, 80, 70)
      const src = canvas.toDataURL('image/png')
      markDiv.style.position = 'fixed'
      markDiv.style.zIndex = '9999'
      markDiv.id = this.markId
      markDiv.style.top = '30px'
      markDiv.style.left = '0'
      markDiv.style.width = '100%'
      markDiv.style.height = '100%'
      markDiv.style.pointerEvents = 'none'
      markDiv.style.backgroundImage = 'URL(' + src + ')'
      // 水印节点插到body下
      document.body.appendChild(markDiv)
    },
    Monitor() {
      const body = document.getElementsByTagName('body')[0]
      const options = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
      }
      const observer = new MutationObserver(this.callback)
      observer.observe(body, options) // 监听body节点
    },
    // DOM改变执行callback
    callback(mutations, observer) {
      // 当attribute属性被修改
      if (mutations[0].target.id === this.markId) {
        this.removeMaskDiv()
      }
      // 当id被改变时
      if (mutations[0].attributeName === 'id' && mutations[0].oldValue === this.markId) {
        this.removeMaskDiv(mutations[0].target.id)
        this.init()
      }
      // 当节点被删除
      if (mutations[0].removedNodes[0] && mutations[0].removedNodes[0].id === this.markId) {
        this.init()
      }
    },
    /* public */
    // 手动销毁水印DOM
    removeMaskDiv(markIdTemp) {
      const mark = document.getElementById(markIdTemp || this.markId)
      mark && document.body.removeChild(mark)
    },
    // 手动生成水印
    createMaskDiv() {
      this.init()
    }
  },
  destroy() {
    // 组件销毁时去除生成在body节点下的水印节点
    if (this.inputDestroy) {
      this.removeMaskDiv()
    }
  }
}
</script>
