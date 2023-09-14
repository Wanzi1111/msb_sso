export const fixedFooter = {
  mounted() {
    this.initFooter()
  },
  beforeDestroy() {
    this.resetFooter()
  },
  methods: {
    initFooter() {
      this.eleActions('.app-footer', 'fixed-footer', 'add')
      this.eleActions('.app-main', 'fixed-main', 'add')
    },
    resetFooter() {
      this.eleActions('.app-footer', 'fixed-footer', 'remove')
      this.eleActions('.app-main', 'fixed-main', 'remove')
    },
    eleActions(sel, fixedSel, action) {
      let el = ''
      if (action === 'add') {
        el = document.querySelector(sel)
        el && el.classList.add(fixedSel)
      } else {
        el = document.querySelector(sel)
        el && el.classList.remove(fixedSel)
      }
    }
  }
}
