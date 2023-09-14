const fs = require('fs')
const path = require('path')
// import chalk from 'chalk'

const { configFileName, configName } = require('../contanst')

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script
  const reg = new RegExp('--mode ([a-z_\\d]+)')
  const result = reg.exec(script)
  if (result) {
    const mode = result[1]
    return [`.env.${mode}`]
  }
  return ['.env.production']
}

/**
 * 对env文件类型解析并输出有效全局变量
 * @param {string} src 文件名
 * @returns {Object} 全局变量
 */
function dotenv_parse(src) {
  const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

  const obj = {}
  let lines = src.toString()

  lines = lines.replace(/\r\n?/mg, '\n')

  let match
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]

    // value 是 undefined 或 null，空字符串作为默认值
    let value = (match[2] || '')

    // 删除空格
    value = value.trim()

    // 检查是否双引号
    const maybeQuote = value[0]

    // 删除周围的引号
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    // 添加到对象
    obj[key] = value
  }

  return obj
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
function getEnvConfig(match = 'VUE_APP_', confFiles = getConfFiles()) {
  try {
    let envConfig = {}
    confFiles.forEach((item) => {
      try {
        const env = dotenv_parse(fs.readFileSync(path.resolve(process.cwd(), item)))
        envConfig = { ...envConfig, ...env }
      } catch (e) {
        console.error(`Error in parsing ${item}`, e)
      }
    })
    const reg = new RegExp(`^(${match})`)
    Object.keys(envConfig).forEach((key) => {
      if (!reg.test(key)) {
        Reflect.deleteProperty(envConfig, key)
      }
    })
    return envConfig
  } catch (error) {
    console.log(('vite build error:\n' + error))
    process.exit(1)
  }
}

// 生成全局变量文件，并将变量挂载到window
async function runBuildConfig() {
  try {
    const windowConf = `window.${configName}`
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(getEnvConfig())};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '')
    fs.writeFileSync(`dist/${configFileName}`, configStr)
    console.log('create _app_config success 🎆')
  } catch (error) {
    console.log('configuration file configuration file failed to package:\n' + error)
  }
}

module.exports = { runBuildConfig }
