(function(window, document, undefined){
  var themes = {
    'green': {
      color: 'color: green;',
      borderLeft: 'border-left: 1px solid green;',
      background: 'background: rgba(0, 200, 0, 0.3);'
    },
    'red': {
      color: 'color: red;',
      borderLeft: 'border-left: 1px solid red;',
      background: 'background: rgba(200, 0, 0, 0.3);'
    },
    'blue': {
      color: 'color: blue;',
      borderLeft: 'border-left: 1px solid blue;',
      background: 'background: rgba(0, 0, 200, 0.3);'
    }
  }
  var _layer = null

  function Monitor(config) {
    if (typeof config === 'string') {
      config = { title: config }
    }
    config.theme = config.theme || 'green'
    this.config = config
    this._frame = createFrame()
    this._title = createTitle(config.theme)
    this._body = createBody(config.theme)
    this._data = []
    this._freq = 1  // urefresh per second

    this.timer = null
    this.setup()

    if (this.config.title)
      this.title(this.config.title)
  }

  Monitor.prototype.title = function (title) {
    if (title)
      this._title.innerHTML = title
    return this._title.innerHTML
  }

  Monitor.prototype.data = function (data) {
    if (data instanceof Array)
      this._data = data
    if (parseInt(data, 10) > 0)
      this._data.push(data)
    return this._data
  }

  Monitor.prototype.show = function () {
    this._frame.style.display = 'block'
    this.autoRefresh(this._freq)
  }

  Monitor.prototype.hide = function () {
    this._frame.style.display = 'none'
    this.autoRefresh(0)
  }

  Monitor.prototype.setup = function () {
    if (!_layer) {
      _layer = document.createElement('div')
      _layer.style.cssText = [
        'position: fixed;',
        'top: 4%;',
        'right: 1%;',
        'z-index: 999999999999;'
      ].join('')
      document.body.appendChild(_layer)
    }
    this._frame.appendChild(this._title)
    this._frame.appendChild(this._body)
    _layer.appendChild(this._frame)
  }

  Monitor.prototype.refresh = function () {
    var percent_100 = this._body.offsetWidth
    var data = this._data.slice(this.data.length - percent_100)
    var start = percent_100 - data.length
    this._body.innerHTML = ''
    for (var i = percent_100; i > start; i --) {
      var index = percent_100 - i
      Monitor.paint(this, data[index], start + index)
    }
  }

  Monitor.prototype.autoRefresh = function (freq) {
    var self = this
    if (parseInt(freq, 10) > 0) {
      this._freq = freq

      if (this.timer) {
        window.clearInterval(this.timer)
      }

      this.timer = window.setInterval(function(){
        self.refresh()
      }, 1000 / freq)

    } else {
      window.clearInterval(this.timer)
    }
  }

  Monitor.prototype.destroy = function () {
    this._data = null
    document.body.removeChild(this._frame)
    window.clearInterval(this.timer)
  }

  Monitor.paint = function (self, height_percent, x) {
    var line = document.createElement('div')
    line.style.cssText = [
      'position: absolute;',
      'left: ' + x + 'px;',
      'bottom: 0;',
      'width: 0;',
      'height: ' + height_percent + '%;',
      themes[self.config.theme].borderLeft,
    ].join('')
    self._body.appendChild(line)
  }

  function createFrame() {
    var frame = document.createElement('div')
    frame.style.cssText = [
      'border: 1px solid black;',
      'background: black;',
      'position: relative;',
      'width: 100px;',
      'height: 50px;',
      'display: none;',
      'margin-bottom: 5px;'
    ].join('')


    return frame
  }

  function createTitle (theme) {
    var title = document.createElement('div')
    title.style.cssText = [
      'position: absolute;',
      'top: 0;',
      'left: 0;',
      'height: 30%;',
      'width: 100%;',
      themes[theme].color,
      'font-size: 12px;',
      'font-family: fantasy;'
    ].join('')

    return title
  }

  function createBody (theme) {
    var body = document.createElement('div')
    body.style.cssText = [
      themes[theme].background,
      'position: absolute;',
      'left: 0;',
      'top: 30%;',
      'height: 70%;',
      'width: 100%'
    ].join('')
    return body
  }


  window.Monitor = Monitor
})(window, document)
