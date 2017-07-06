var fs = require('fs')
var path = require('path')
var Engine = require('freemarker.js')

var resolve = path.resolve

var __CONFIG = {
  viewRoot: './',
  dataRoot: './'
}

var fetchData = function(filePath) {
  if (!filePath) return
    
  filePath = resolve(__CONFIG.dataRoot, './' + filePath)

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath).toString()
  } else {
    throw new Error('未找到对应的 ' + filePath + ' 文件，请检查数据')
  }
}

function corender(opts) {
  var engine = new Engine(opts)

  return function(cb) {
    engine.render(opts.tpl, opts.data, function(err, html, output) {
        if (err) return cb(err)

        cb(null, html)
      })
  }
}

function Freemarker(opts) {

  var options = {
    viewRoot: resolve(opts.viewRoot),
    options: opts.options
  }

  __CONFIG = Object.assign(__CONFIG, opts)

  return function* freemarker(next) {
    yield next

    var reg = new RegExp(path.normalize(opts.viewRoot))
    var data = fetchData(this.path.replace(reg, '').split('.')[0] + '.js')

    try {
      data = JSON.parse(data)
    } catch(err) {
      throw new Error('数据：' + this.path.split('.')[0] + '.js' + ' 不是标准的JSON格式')
    }

    options = Object.assign(options, {
      data: data,
      tpl: path.basename(this.path)
    })

    this.body = yield corender(options)
    this.type = 'text/html'
  }
}

module.exports = Freemarker