const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
const handlebarsHelpers = require('handlebars-helpers')

require('./helpers')(hexo)

const handlebarsRenderer = (data, locals) => {
  const template = handlebars.compile(data.text)
  const helperDir = path.join(hexo.theme_dir, 'helper')

  const partialDir = path.join(hexo.theme_dir, 'layout', 'partials')
  let partials

  try {
    partials = fs.readdirSync(partialDir)
  } catch (e) {
    console.error(e)
  }

  if (partials) {
    partials.forEach(function (fname) {
      if (fname.split('.').slice(-1)[0] !== 'hbs') {
        return
      }

      handlebars.registerPartial(fname.split('.')[0], fs.readFileSync(path.join(partialDir, fname)).toString())
    })
  }

  let helpers = {}
  try {
    helpers = require(helperDir)(hexo)
  } catch (e) {
    console.error(e)
  }

  helpers = Object.assign({}, handlebarsHelpers, helpers)

  return template(locals, {helpers})
}

['hbs', 'handlebars'].forEach(ext => {
  hexo.extend.renderer.register(ext, 'html', handlebarsRenderer, true)
})

exports.handlebars = handlebars
