'use strict'
/* eslint-disable no-control-regex */
const getRawBody = require('raw-body')

const strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/
let strict

module.exports = function (opts) {
  opts = opts || {}
  // defaults
  opts.encoding = opts.encoding || 'utf8'
  opts.limit = opts.limit || '1mb'
  strict = opts.strict !== false

  return async (ctx, next) => {
    // var len = this.req.headers['content-length']
    // if (len) opts.length = len = ~~len
    const bodyString = await getRawBody(ctx.req, opts)

    try {
      ctx.request.body = parse(bodyString)
    } catch (err) {
        ctx.request.body = bodyString
    }

    await next()
  }
}

function parse (str) {
  if (!strict) return str ? JSON.parse(str) : str
  // strict mode always return object
  if (!str) return {}
  // strict JSON test
  if (!strictJSONReg.test(str)) {
    throw new Error('invalid JSON, only supports object and array')
  }
  return JSON.parse(str)
}
