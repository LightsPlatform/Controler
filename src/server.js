const Koa = require('koa');
const Router = require('koa-router')
const parser = require('./body-parser')
const mount = require('koa-mount')
const koaBody = require('koa-body');
const app = new Koa();
const router = new Router()

app
    .use(koaBody())
    .use(router.allowedMethods())
    .use(mount(require('./routes/sensor')))
    .use(mount(require('./routes/actuator')))
    .use(mount(require('./routes/broker')))
    .use(mount(require('./routes/connection')))

const port = process.env.PORT || 5000
app.listen(port)
console.log(`listening on port ${port}`)
