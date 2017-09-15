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
  setJson: function (key, obj) {
    localStorage.setItem(key, json_encode(obj))
  },
  getJson: function (key) {
    return json_decode(this.get(key))
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

const CACHE_KEY_THEME = config.siteName + '_theme'
// const CACHE_KEY_CODE_THEME = config.siteName + '_code_theme'
const CACHE_KEY_PREFIX = config.siteName + ':'

const loading = $('#loading-layer')
const request = getUrlRequest()
const titleEl = $('head>title')
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

$(function () { // init logic
  someUICheck()
  fetchDocCatelog()
  showPageContent(request.p ? request.p : config.defaultPage);
})

function prepareInit() {
  if ($(window).width() < 769) {
    config.makeTOC = false
    $('body').removeClass('with-sidebar')
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
  $('#top-logo').html(config.siteName)
  $('.project-url').attr('href', config.projectUrl)
  $('.issue-url').attr('href', config.issueUrl)
  $('.author-page').attr('href', config.authorPage)
  $('.author-name').text(config.authorName)
}

function someUICheck() {
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
    $('body').toggleClass('with-sidebar')
  })

  $('#refresh-btn').on('click', function() {
    let pageUrl = $('#content').attr('data-url')

    showPageContent(pageUrl, null, true)
  })
}

function fetchDocCatelog() {
  $.get(config.dataUrl + config.catelogPage, function (res) {
    // console.log(res);

    let sidebar = $('#sidebar')
    let html = md.render(res)

    sidebar.html(html ? html : 'No catelog data')
    sidebar.find('a').on('click', function (e) {
      e.preventDefault() // 默认事件
      e.stopPropagation() // 事件冒泡
      let href = $(this).attr('href')
      let title = $(this).text()

      sidebar.find('a').removeClass('active')
      $(this).addClass('active')

      // 改变地址栏URL
      window.history.pushState({name: title}, "", request.p)
      window.history.replaceState({name: title}, "", config.basePath + '?p=' + href)

      showPageContent(href, title)
    })
  }, 'text');
}

function showPageContent(pageUrl, title, refresh) {
  refresh = refresh === undefined ? false : refresh
  $('#edit-btn').attr('href', config.editUrl + '/' + pageUrl)

  loading.toggle()

  let cacheKey = CACHE_KEY_PREFIX + pageUrl
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

    content.attr('data-url', pageUrl).html(html)

    if (config.makeTOC) {
      createContentTOC(content)
    }

    if (!title) {
      title = content.find('h1').first().text()
    }

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

function createContentTOC(contentBox) {
  let tocList = $("#content-toc"),
      tocBox = $('#content-toc-box'),
      hList = contentBox.find("h2,h3,h4,h5,h6")

  if (!hList[0]) {
    tocBox.hide()
    return
  }
  tocList.html('')
  hList.each(function(i,item){
    var tag = $(item).get(0).localName;

    $(item).attr("id","wow_"+i);
    tocList.append('<a class="toc-'+tag+'" href="#wow_'+i+'">'+$(this).text()+'</a></br>');
    tocList.find(".toc-h2").css("margin-left",0);
    tocList.find(".toc-h3").css("margin-left",15);
    tocList.find(".toc-h4").css("margin-left",30);
    tocList.find(".toc-h5").css("margin-left",45);
    tocList.find(".toc-h6").css("margin-left",60);
  });

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
