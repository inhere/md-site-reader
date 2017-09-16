const storage = {
  set: function (key, value) {
    localStorage.setItem(key, value)
  },
  get: function (key) {
    return localStorage.getItem(key)
  },
  sets: function (datas) {
    datas.forEach(data => this.set(data.key, data.value))
  },
  gets: function (keys) {
    return keys.map(key => this.get(key))
  },
  del: function (key) {
    return localStorage.removeItem(key)
  },
  key: function (index) {
    return localStorage.key(index)
  },
  has: function (key) {
    return this.get(key) !== null
  },
  len: function () {
    return localStorage.length
  },
  clear: function (keys) {
    if (keys) {
      keys.forEach(key => this.del(key))
    } else {
      localStorage.clear()
    }
  }
}

const CACHE_KEY_THEME = config.siteKey + '_theme'
// const CACHE_KEY_CODE_THEME = config.siteKey + '_code_theme'
const CACHE_PREFIX_CONTENT = config.siteKey + ':'

const theBook = $('div.book')
const loading = $('#loading-layer')
const request = getUrlRequest()
const titleEl = $('head>title')
const sidebar = $('#sidebar')
const md = window.markdownit({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }

      return ''; // use external default escaping
    }
})

prepareInit()

window.onpopstate = function(event) {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
}

$(function () { // init logic
  init()
  showDocCatelog()
  showPageContent(request.p ? request.p : config.defaultPage);

  setTimeout(function () {
    loading.hide()
    theBook.fadeIn()
  }, 500)
})

function prepareInit() {
  loading.show()

  if ($(window).width() < 769) {
    config.makeTOC = false
    theBook.removeClass('with-sidebar')
  }

  let theme = storage.get(CACHE_KEY_THEME)
  theme = theme ? theme : config.theme

  if (themes[theme]) {
    config.navHeight = themes[theme]
  } else {
    // reset to default
    theme = 'paper'
    config.navHeight = themes.paper
  }

  config.theme = theme

  // load theme css
  $('#bts-style-link').attr('date-theme', theme).attr('href', 'assets/lib/bootswatch/' + theme + '/bootstrap.min.css')
  $('#code-style-link').attr('date-theme', config.codeTheme).attr('href', 'assets/lib/highlight/styles/' + config.codeTheme + '.css')

  // add some info to page
  $('#top-logo').attr('href', config.logoUrl).html(config.siteName)
  $('.site-des').text(config.siteDes)
  $('.site-name').text(config.siteName)
  $('.project-url').attr('href', config.projectUrl)
  $('.doc-url').attr('href', config.docUrl)
  $('.issue-url').attr('href', config.issueUrl)
  $('.author-page').attr('href', config.authorPage)
  $('.author-name').text(config.authorName)
}

function init() {
  $('#sidebar-box').css({'top': config.navHeight + 'px'})
  $('#content-box').css({'top': config.navHeight + 'px'})

  // render theme list
  let list = ''
  Object.keys(themes).forEach(function (name) {
    if (config.theme === name) {
      list += `<option value="${name}" selected>${name}</option>`
    } else {
      list += `<option value="${name}">${name}</option>`
    }
  })
  $('#theme-list').html(list)

  // bind some events
  $('#theme-list').on('change', function () {
    let newTheme = $(this).val()
    storage.set(CACHE_KEY_THEME, newTheme)
    window.location.reload()
  })

  $('#sidebar-ctrl').on('click', function () {
    theBook.toggleClass('with-sidebar')
  })

  $('#refresh-btn').on('click', function() {
    let pageUrl = $('#content').attr('data-url')

    showPageContent(pageUrl, null, true)
  })

  $('#search-input').on('keyup', function(e) {
    catelogSearch($(this).val())
  })

  $('#clear-search-input').on('click', function(e) {
    let kw = $('#search-input').val()

    if (kw) {
      $('#search-input').val('')

      catelogSearch('')
    }
  })
}

function showDocCatelog() {
  $.get(config.dataUrl + config.catelogPage, function (res) {
    // console.log(res);

    // let sidebar = $('#sidebar')
    let html = md.render(res)
    let icon = ' <i class="fa fa-check search-matched hide"></i>'

    sidebar.html(html ? html : 'No catelog data')
    sidebar.find('a').append(icon).on('click', catelogLinksHandler)
  }, 'text');
}

function catelogLinksHandler(e) {
  e.preventDefault() // 默认事件
  e.stopPropagation() // 事件冒泡
  let href = $(this).attr('href')
  let title = $(this).text()

  sidebar.find('a').removeClass('active')
  $(this).addClass('active')

  // 将地址栏URL加入历史
  window.history.pushState({name: title}, "", location.pathname + '?p=' + request.p)
  // 改变地址栏URL
  // window.history.replaceState({name: title}, "", config.basePath + '?p=' + href)
  window.history.replaceState({name: title}, "", location.pathname + '?p=' + href)

  showPageContent(href, title)
}

function showPageContent(pageUrl, title, refresh) {
  refresh = refresh === undefined ? false : refresh
  $('#edit-btn').attr('href', config.editUrl + '/' + pageUrl)

  loading.toggle()

  let cacheKey = CACHE_PREFIX_CONTENT + pageUrl
  let successHandler = function (res) {
    // console.log(res);
    let content = $('#content')
    let html = ''

    if (res) {
      // add cache
      storage.set(cacheKey, res)
      html = md.render(res)
    } else {
      html = '<h2 class="text-muted">' + config.emptyData + '</h2>'
    }

    // has image tag
    if (html.indexOf('<img src="') > 0) {
      html = html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, '<img class="img-responsive" src="' + config.dataUrl + '$1">')
    }

    content.attr('data-url', pageUrl).html(html)

    if (config.makeTOC) {
      createContentTOC(content)
    }

    if (!title) {
      title = content.find('h1').first().text()
    }

    content.find('a').each(function() {
      let href = $(this).attr('href')

      // outside link
      if (href.search(/^http[s]/) > -1) {
        $(this).attr('target', '_blank')

        // inside link
      } else {
        $(this).on('click', catelogLinksHandler)
      }
    })

    $('#content-box').scrollTop(0)
    $('#doc-url').text(decodeURI(pageUrl))
    // show title
    titleEl.text(config.baseTitle + ' - ' + title)

    loading.toggle()
  }

  if (refresh || !storage.has(cacheKey)) {
    $.ajax({
      url: config.dataUrl + pageUrl,
      type: 'GET',
      dataType: 'text',
      success: successHandler,
      error: function(xhr){
        if (xhr.status === 404) {
            $('#content').html('<h2 class="text-muted">' + config.emptyData + '</h2>')
        } else {
          alert("ERROR: (" + xhr.status + ") " + xhr.statusText);
        }

        loading.toggle()
      }
    })
  } else {
    successHandler(storage.get(cacheKey))
  }
}

function catelogSearch(kw) {
  kw = kw.trim()
  sidebar.find('li').removeClass('hide')
  sidebar.find('i').addClass('hide')

  if (!kw) {
    return
  }

  kw = kw.toLowerCase()
  sidebar.find('a').each(function(i, el) {
    let elDom = $(el)
    let href = elDom.attr('href').toLowerCase()
    let text = elDom.text().toLowerCase()

    console.log(kw, href, text)

    // is parent li subLi > 0
    let subLi = elDom.next('ul').find('li')
    let isParent = subLi.length > 0
    let showSubLiNum = 0

    if (isParent) {
      showSubLiNum = subLi.find(':not(.hide)').length
    }

    // not match
    if (text.indexOf(kw) < 0 && href.indexOf(kw) < 0) {
      if (isParent && showSubLiNum === 0) {
        elDom.parent('li').addClass('hide')

        // is last sub li
      } else if (!isParent && showSubLiNum === 1) {
        elDom.parents('li').addClass('hide')
      } else {
        elDom.parent('li').addClass('hide')
      }
    } else {
      // open icon
      elDom.find('i').removeClass('hide')

      if (!isParent) {
        elDom.parents('li').removeClass('hide')
      }
    }
  })
}

function createContentTOC(contentBox) {
  let tocBox = $('#content-toc-box'),
    tocList = $("#content-toc"),
    hList = contentBox.find("h2,h3,h4,h5,h6")

  if (!hList[0]) {
    tocBox.hide()
    return
  }
  tocList.html('')
  hList.each(function(i,item){
    var tag = $(item).get(0).localName;

    $(item).attr("id","wow_"+i);
    tocList.append('<a class="toc-'+tag+'" data-tag="' + tag + '" href="#wow_'+i+'">'+$(this).text()+'</a></br>')
    tocList.find(".toc-h2").css("margin-left",0)
    tocList.find(".toc-h3").css("margin-left",15)
    tocList.find(".toc-h4").css("margin-left",30)
    tocList.find(".toc-h5").css("margin-left",45)
    tocList.find(".toc-h6").css("margin-left",60)
  })

  tocBox.show()
}

function getUrlRequest(){
  let url = location.search //获取url中"?"符后的字串
  let theRequest = new Object()

  if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      if (str.indexOf("&") != -1) {
          strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
              theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
      } else {
          var key = str.substring(0,str.indexOf("="));
          var value = str.substr(str.indexOf("=")+1);
          theRequest[key] = decodeURI(value);
      }
  }

  return theRequest
}
