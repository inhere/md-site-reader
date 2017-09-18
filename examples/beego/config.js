  // page title = baseTile + content title
config.baseTitle = 'beego 文档'
config.siteName = 'beego 文档'
config.siteDes = 'beego 是一个快速开发 Go 应用的 HTTP 框架'
config.siteKey = 'beego-doc'

config.logoUrl = '/examples/beego/'
config.assetBasePath = '/'

config.lang = 'zh-CN'
config.langs = ["en-US", "zh-CN"]

config.docProject = 'beego/beedoc'
//   // e.g https://raw.githubusercontent.com/{astaxie/build-web-application-with-golang}/master/{beanfactory.md}
// config.dataUrl = 'https://raw.githubusercontent.com/beego/beedoc/master/zh-CN/'
// config.docUrl = 'https://github.com/beego/beedoc'
// config.editUrl = 'https://github.com/beego/beedoc/edit/master'

config.project = 'astaxie/beego'
// config.projectUrl = 'https://github.com/inhere/md-site-reader'
// config.issueUrl = 'https://github.com/astaxie/beego/issues'

config.authorName = 'astaxie'
config.authorPage = 'https://github.com/astaxie'

config.theme = 'paper'
config.codeTheme = 'github'
config.catelogPage = '/examples/beego/catelog.md'
config.defaultPage = 'intro/Introduction.md'
config.makeTOC = true
config.emptyData = 'No content to display!'

config.onContentWrited = function (contentDom) {
  // contentDom.find('h1').first().prev('h2').remove()
  contentDom.find('h1').first().prevAll().remove()
}
