# markdown documents site reader

一个非常简单的markdown文档站点阅读器小工具，自动拉取目录数据并生成目录侧边栏，自动根据文档生成TOC。
只需几步就可以将一个 github 上的 markdown 文档仓库渲染成一个文档站点

- 纯静态渲染，只要有一个可以放静态文件的服务器, 配置好相关信息。访问 `index.html` 即可(可以直接使用代码托管平台的pages服务)
- 原生支持渲染 gitbook 导出的 markdown 站点
- 可直接渲染github(或者其他任意git代码托管平台)上的任意一个 markdown 文档仓库，无需拉取仓库代码
- 简单的目录搜索功能支持(会将目录的 链接文字和链接href 作为匹配目标)
- 样式使用基于bootstrap 3 的 bootswatch(可以直接在页面底部切换各种主题)
- 自动缓存内容到本地(localSorage)，加快二次打开速度
- 使用highlight添加代码高亮支持

> 将此仓库代码拉取到你的服务器上使用，速度会比直接使用 github pages更好

## 项目仓库

- **github** https://github.com/inhere/md-site-reader.git
- **git@osc** https://git.oschina.net/inhere/md-site-reader.git

## 使用以及配置

你可以通过 `config.js` 来覆盖默认配置, 然后访问 `index.html` 即可

## 示例

**示例文档** https://inhere.github.io/md-site-reader/

示例渲染的是 @astaxie 的github项目 [《Go web 编程》](https://github.com/astaxie/build-web-application-with-golang)

- 示例访问的就是当前仓库的 `index.html`
- 示例配置请看文件 `config.js`

```js
  // page title = baseTile + content title
config.baseTitle = 'Go Web 编程'
config.siteName = '《Go Web 编程》'
config.siteDes = 'Go Web 编程的描述信息'
config.siteKey = 'go-web-dev'
config.logoUrl = '/md-site-reader/'

config.docProject = 'astaxie/build-web-application-with-golang'
//   // e.g https://raw.githubusercontent.com/{astaxie/build-web-application-with-golang}/master/{beanfactory.md}
config.dataUrl = 'https://raw.githubusercontent.com/astaxie/build-web-application-with-golang/master/zh/'
config.docUrl = 'https://github.com/astaxie/build-web-application-with-golang'
//   // e.g https://github.com/astaxie/build-web-application-with-golang/edit/master/http.md
config.editUrl = 'https://github.com/astaxie/build-web-application-with-golang/edit/master'

config.project = 'inhere/md-site-reader'
config.projectUrl = 'https://github.com/inhere/md-site-reader'
config.issueUrl = 'https://github.com/astaxie/build-web-application-with-golang/issues'

config.authorPage = 'https://github.com/astaxie'
config.authorName = 'astaxie'

config.theme = 'paper'
config.codeTheme = 'github'
config.catelogPage = 'SUMMARY.md'
config.defaultPage = 'README.md'
config.makeTOC = true
config.emptyData = 'No content to display!'
```

- 效果预览：

![alt text](assets/images/20170916-115623.jpg "example")

## 更多书籍文档

**请看站点** https://git-books.github.io/

github 仓库： https://github.com/git-books/git-books.github.io

收集了一些github上的书籍文档。 

### 全部配置项

```js
// file: assets/js/config.defalut.js
{
  // use for cache prefix
  siteKey: 'swoft',
  siteName: 'Swoft',
  siteDes: 'the description text',
  // page title = baseTile + content title
  baseTitle: 'Swoft Doc',
  // basePath: ,
  logoUrl: '/',

  docProject: '',
  // e.g https://raw.githubusercontent.com/{swoft-cloud/swoft-doc}/master/{beanfactory.md}
  dataUrl: '',
  docUrl: '',
  // e.g https://github.com/swoft-cloud/swoft-doc/blob/master/http.md
  editUrl: '',

  project: '',
  projectUrl: '',
  issueUrl: '',

  authorPage: '',
  authorName: '',

  emptyData: 'No content to display!',
  catelogPage: 'SUMMARY.md',
  defaultPage: 'README.md',

  // assets/lib/bootswatch/{theme:paper}/bootstrap.min.css
  theme: 'paper',
  // assets/lib/highlight/styles/{codeTheme:github}.css
  codeTheme: 'github',
  makeTOC: true,
  /* £ $ & β ξ ψ ℘ § */
  anchorIcon: '℘',
  tableClass: 'table table-bordered table-striped'
}
```

## License

MIT
