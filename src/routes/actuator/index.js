const Koa = require('koa')
const Router = require('koa-router')
const request = require('superagent');
const prefix = require('superagent-prefix')('http://localhost:8181/api');

const app = new Koa()
const router = new Router()

router.get('/api/actuators', async (ctx) => {
    try {
        const t = await request
            .get('/actuator')
            .use(prefix)
        console.log(t.body)
        ctx.body = {actuators: t.body}
    } catch (e) {
        ctx.status = 500
    }
})


app.use(router.routes())

module.exports = app
