(function(window, document, undefined){
  function Monitor() {
    this._frame = createFrame()
    this._title = createTitle()
    this._body = createBody()
    this._data = []
    this._freq = 1  // urefresh per second

    this.timer = null
    this.setup()
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
    this._frame.appendChild(this._title)
    this._frame.appendChild(this._body)
    document.body.appendChild(this._frame)
  }

  Monitor.prototype.refresh = function () {
    var percent_100 = this._body.offsetWidth
    var data = this._data.slice(this.data.length - percent_100)
    var start = percent_100 - data.length
    this._body.innerHTML = ''
    for (var i = percent_100; i > start; i --) {
      var index = percent_100 - i
      Monitor.paint(this._body, data[index], start + index)
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

  Monitor.paint = function (canvas, height_percent, x) {
    var line = document.createElement('div')
    line.style.cssText = [
      'position: absolute;',
      'left: ' + x + 'px;',
      'bottom: 0;',
      'width: 0;',
      'height: ' + height_percent + '%;',
      'border-left: 1px solid green;'
    ].join('')
    canvas.appendChild(line)
  }

  function createFrame() {
    var frame = document.createElement('div')
    frame.style.cssText = [
      'border: 1px solid black;',
      'background: black;',
      'position: fixed;',
      'top: 4%;',
      'right: 1%;',
      'width: 100px;',
      'height: 50px;',
      'display: none;'
    ].join('')


    return frame
  }

  function createTitle (titleText) {
    var title = document.createElement('div')
    title.style.cssText = [
      'position: absolute;',
      'top: 0;',
      'left: 0;',
      'height: 30%;',
      'width: 100%;',
      'color: green;',
      'font-size: 12px;',
      'font-family: fantasy;'
    ].join('')
    if (titleText)
      title.innerHTML = titleText

    return title
  }

  function createBody () {
    var body = document.createElement('div')
    body.style.cssText = [
      'background: rgba(0, 200, 0, 0.3);',
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
