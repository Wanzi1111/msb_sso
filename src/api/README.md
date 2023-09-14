# API

**This directory is not required, you can delete it if you don't want to use it.**

api文件夹目录树对照views页面创建

如果多个baseURL,先配置根目录的.env.xx配置文件，再在request中使用baseURL覆盖

```
return request({
    url: '/article/list',
    method: 'get',
    params: query,
    baseURL: 'xxxx' // 直接通过覆盖的方式
  })
```