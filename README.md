# mat-freemarker

## Installation

```sh
npm install --save-dev mat-freemarker
```

## Basic Usage

```javascript
var mat   = require('mat')
var freemarker = require('mat-freemarker')

mat.task('freemarker', function() {
  mat.url([/\.ftl/])
    .use(freemarker({
      viewRoot: '/template',
      dataRoot: '/fakeData',
      options: {
        
      }
    }))
})
```
## Options
  
  * viewRoot: ftl模板目录
  * dataRoot: 需要渲染的数据目录，文件命名与ftl模板保持一致，保存为 `.js` 文件
  * See the freemarkerjs [options](https://github.com/ijse/freemarker.js#configurations)
