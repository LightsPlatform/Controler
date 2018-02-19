const Koa = require('koa');
const Router = require('koa-router')
const parser = require('./body-parser')
const mount = require('koa-mount')

const app = new Koa();
const router = new Router()

app
    .use(parser())
    .use(router.allowedMethods())
    .use(mount(require('./routes/sensor')))

const port = process.env.PORT || 5000
app.listen(port)
console.log(`listening on port ${port}`)
