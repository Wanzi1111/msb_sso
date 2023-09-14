<!--
 * @Author: yelei
 * @Date: 2021-01-23 14:50:30
 * @LastEditors: yelei
 * @LastEditTime: 2021-01-23 15:44:21
 * @Description: 
-->
# 美术宝1对1 • 运营管理后台\[msb-admin-operations-management]

# proxy配置说明

# * [环境配置] 

dev：线上开发环境

test：线上测试环境

staging：预发布环境

product：生产环境

# * [参数详情]
# 代理域名
target: "http://msi.yiqimeishu.com/vip-app-live"

# 是否开启域名代理 true开启 不配置默认为 false 
changeOrigin: true,

# 是否开启域名代理 key：链接中匹配的字符串 value：替换匹配后的字符串
pathRewrite: { '^/k8s': '/' }

# debug 模式 开启后可查看当前代理请求接口的真实地址
logLevel: 'debug',

# * 接口 环境域名变量集合

* [/logistics] 物流/商品 接口
  // 开发 https://logisticsdev-mp.meishubao.com
  // 测试 https://logisticstest-mp.meishubao.com
  // 预发布 https://logisticsgray-mp.meishubao.com
  // 生产 https://logistics-mp.meishubao.com
