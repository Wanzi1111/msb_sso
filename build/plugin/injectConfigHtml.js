'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.InjectHtmlPlugin = void 0

const fs = require('fs')
const path = require('path')
const { configFileName } = require('../contanst')
const { runBuildConfig } = require('./buildEnv')

// 向index.html追加全局变量挂载脚本
class InjectHtmlPlugin {
  constructor(config) {
    this.config = { ...config, configFileName }
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(
      'InjectHtmlPlugin',
      () => this.inject()
    )
  }
  async inject() {
    await runBuildConfig()
    const { publicPath, configFileName } = this.config
    const configSrc = publicPath + configFileName
    const scriptConfigStr = `<script src=${configSrc}?v=${new Date().getTime()}></script>`
    const keyword = '</body>'

    const htmlStr = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8')
    const htmlStrList = htmlStr.split(keyword)

    const newHtmlStr = htmlStrList[0] + scriptConfigStr + keyword + htmlStrList[1]
    fs.writeFileSync('dist/index.html', newHtmlStr)
    console.log('inject _app_config success 🎆')
  }
}
exports.InjectHtmlPlugin = InjectHtmlPlugin
exports.default = InjectHtmlPlugin

module.exports = InjectHtmlPlugin
