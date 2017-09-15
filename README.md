# markdown documents site reader

一个非常简单的markdown文档站点阅读器小工具

- 纯静态渲染，只要有一个可以放静态文件的服务器, 配置好相关信息。访问 `index.html` 即可
- 支持gitbook 导出的 markdown 站点
- 可直接渲染github上的任意一个 markdown 文档仓库
- 样式基于bootswatch(可以直接在页面切换各种主题)
- 自动本地缓存，加快二次打开速度
- 使用highlight添加代码高亮

## 全部配置项

> see file: assets/js/config.js

```js
const config = {
  // page title = baseTile + content title
  baseTitle: 'Swoft Doc',
  siteName: 'Swoft',
  basePath: location.pathname,

  docProject: 'swoft-cloud/swoft-doc',
  // e.g https://raw.githubusercontent.com/{swoft-cloud/swoft-doc}/master/{beanfactory.md}
  dataUrl: 'https://raw.githubusercontent.com/swoft-cloud/swoft-doc/master/',
  docUrl: 'https://github.com/swoft-cloud/swoft-doc',
  // e.g https://github.com/swoft-cloud/swoft-doc/edit/master/http.md
  editUrl: 'https://github.com/swoft-cloud/swoft-doc/edit/master',

  project: 'swoft-cloud/swoft',
  projectUrl: 'https://github.com/swoft-cloud/swoft',
  issueUrl: 'https://github.com/swoft-cloud/swoft/issues',

  authorPage: 'https://github.com/stelin',
  authorName: 'stelin',

  // assets/lib/bootswatch/{theme:paper}/bootstrap.min.css
  theme: 'paper',
  // assets/lib/highlight/styles/{codeTheme:github}.css
  codeTheme: 'github',
  catelogPage: 'SUMMARY.md',
  defaultPage: 'README.md',
  makeTOC: true,
  emptyData: 'No content to display!'
}
```

## License

MIT
