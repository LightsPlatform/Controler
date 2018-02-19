const Koa = require('koa')
const Router = require('koa-router')
const request = require('superagent');
const prefix = require('superagent-prefix')('http://localhost:8080/api');

const app = new Koa()
const router = new Router()

router.get('/api/sensors', async (ctx) => {
    try {
        const t = await request
            .get('/sensor')
            .use(prefix)
        console.log(t.body)
        ctx.body = {sensors: t.body}
    } catch (e) {
        ctx.status = 500
    }
})

router.post('/api/sensor/:id', async (ctx) => {
    const id = ctx.params.id
    ctx.assert(id, 400, "Sensor id is required!")
    const code = ctx.request.body
    ctx.assert(code, 400, "code must send!")
    try {
        const t = await request
            .post(`/sensor/${id}`)
            .use(prefix)
            .send(code)
        ctx.status = 204
    } catch (e) {
        ctx.status = 500
    }
})

router.del('/api/sensor/:id', async (ctx) => {
    const id = ctx.params.id
    ctx.assert(id, 400, "Sensor id is required!")
    try {
        const t = await request
            .del(`/sensor/${id}`)
            .use(prefix)
        ctx.status = 204
    } catch (e) {
        ctx.status = 500
        ctx.body = e
    }
})


app.use(router.routes())

module.exports = app
