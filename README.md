# 美术宝 • 统一登录平台\[msb-admin-auth-center]

## 后、平台登录接入指南
### 1、重构原登录界面流程，改为跳转到sso进行项目绑定、登录操作。（sso各环境地址见下）
  - 需要进行登录操作时，location.href指向sso地址，并追加from参数，值为当前location.href（标记来源，用于项目匹配及快捷跳转登录）
  - 如果为本地开发，还需再追加productUrl参数，值当前项目的对应环境的线上环境地址（兼容本地开发，本地开发href通常为localhost，追加productUrl用于匹配当前项目、登录时跳转到当前项目本地开发地址）

```
<!-- 代码示例 vue版 -->

# env 环境配置
VUE_APP_SSO_URL = 'https://sso-test.meishubao.com'
VUE_APP_PRODUCT_URL = 'https://mp-test.meishubao.com'

# 构造链接跳转
const { VUE_APP_SSO_URL, NODE_ENV, VUE_APP_PRODUCT_URL } = process.env
let loginUrl = `${VUE_APP_SSO_URL}/login?from=${window.location.href}`
// 兼容下本地跳转登录
if (NODE_ENV === 'development') {
  loginUrl += `&productUrl=${VUE_APP_PRODUCT_URL}`
}
window.location.href = loginUrl
```

### 2、在sso平台进行项目绑定及跳转登录认证、获取授权码。
  - 钉钉授权登录sso平台。
  - 首次绑定当前项目会自动弹出项目绑定框。项目绑定框入口为点击右上角头像 -> 项目绑定。
  - 若已绑定当前项目、则会在当前面板的中上方固定位置展示当前项目，可快捷跳转登录。
  - 绑定项目时，需检查当前账号是否正确，选择绑定项目，滑块认证后输入四位短信验证码，点击绑定完成项目绑定流程（测试环境验证码为固定的1234）。
  - 点击项目图标即可进行跳转认证，认证通过会window.open(url?auth_code)，url值为from参数或为所点项目redirect_url，auth_code为授权码，用于获取token。


### 3、在新标签页通过location拿到auth_code，再通过/api/v1/token/get获取token，完成登录流程~（sso各环境接口地址见下）
  - 获取token接口为Get方法，参数为auth_code
  - 拿到token后，获取用户信息等操作与项目服务端沟通~~


### 4、注意事项
  - 确保location只要有auth_code就进行登录操作！！
  - 登录前进行一次登出操作、清楚缓存~

## sso环境地址
|环境|地址|
| ------------ | ------------ |
|开发|https://sso-dev.meishubao.com|
|测试|https://sso-test.meishubao.com|
|预发|https://sso-prod.meishubao.com|
|生产|https://sso.meishubao.com|

## sso接口地址
|环境|地址|
| ------------ | ------------ |
|开发|https://resso-dev.meishubao.com|
|测试|https://resso-test.meishubao.com|
|预发|https://resso-prod.meishubao.com|
|生产|https://resso.meishubao.com|# msb_sso
