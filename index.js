var fs = require('fs')
var path = require('path')
var Engine = require('freemarker.js')

var resolve = path.resolve

var fetchData = function(filePath) {
  if (!filePath) return
  
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath).toString()
  } else {
    throw new Error('未找到对应的 ' + filePath + ' 文件，请检查数据是否正确')
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

  return function* freemarker(next) {
    yield next

    var reg = new RegExp('/' + path.normalize(opts.viewRoot) + '/')
    var dataPath = this.path.replace(reg, path.normalize(opts.dataRoot) + '/').split('.')[0] + '.json'
    var data = fetchData(resolve(dataPath))

    try {
      data = JSON.parse(data)
    } catch(err) {
      throw new Error('数据：' + resolve(dataPath) + ' 不是标准的JSON格式')
    }

    options = Object.assign(options, {
      data: data,
      tpl: this.path.replace(reg, './')
    })

    this.body = yield corender(options)
    this.type = 'text/html'
  }
}

module.exports = Freemarker