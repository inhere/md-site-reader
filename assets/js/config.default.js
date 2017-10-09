// the all config
const config = {
  // use for cache prefix
  siteName: 'beego doc',
  siteKey: 'beego-doc',
  siteDes: 'the description text',
  // page title = baseTile + content title
  baseTitle: 'beego-doc',
  assetBasePath: '',
  logoUrl: location.pathname,

  docType: 'md', // 'rst'

  lang: '', // zh-CN
  langs: [], // ["en", "zh-CN"],

  docProject: 'beego/beedoc',
  docUrl: 'https://github.com/{docProject}',
  // e.g https://raw.githubusercontent.com/{beego/beedoc}/master/{zh-CN}/{intro/README.md}
  dataUrl: 'https://raw.githubusercontent.com/{docProject}/master/{lang}/',
  // e.g https://github.com/{beego/beedoc}/edit/master/zh-CN/http.md
  // e.g https://github.com/{beego/beedoc}/blob/master/zh-CN/http.md
  editUrl: 'https://github.com/{docProject}/blob/master/{lang}/',
  docIssueUrl: 'https://github.com/{docProject}/issues',

  project: 'astaxie/beego',
  projectUrl: 'https://github.com/{project}',
  issueUrl: 'https://github.com/{project}/issues',

  authorName: 'astaxie',
  authorPage: 'https://github.com/astaxie',

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
  tableClass: 'table table-bordered table-striped',
  // topLinks: ['<a href="/"><i class="fa fa-undo" aria-hidden="true"></i> back books list</a>'],
  topLinks: null,
  bottomLinks: null,

  // some events
  onCatelogWrited: null,
  onCatelogHandled: null,
  onContentWrited: null,
  onContentHandled: null
}

config.themes = {
  // theme name: nav height
  cerulean: 51,
  cyborg: 51,
  flatly: 61,
  journal: 61,
  readable: 66,
  simplex: 41,
  spacelab: 51,
  united: 51,
  cosmo: 51,
  // darkly: 61,
  lumen: 51,
  paper: 65,
  sandstone: 63,
  slate: 52,
  superhero: 40,
  yeti: 45
}
