const Koa = require('koa')
const Router = require('koa-router')
const request = require('superagent');
const prefix = require('superagent-prefix')('http://localhost:1375/api');
const app = new Koa()
const router = new Router()

router.get('/api/brokers', async (ctx) => {
    try {
        const t = await request
            .get('/group')
            .use(prefix)
        console.log(t.body)
        ctx.body = {groups: t.body}
    } catch (e) {
        ctx.status = e.status
    }
})

router.post('/api/broker/', async (ctx) => {
    const name = ctx.request.body.name
    ctx.assert(name, 400, "name must send!")
    try {
        const t = await request
            .post(`/group/`)
            .use(prefix)
            .send(ctx.request.body)
        ctx.status = 200
        ctx.body = t.body
    } catch (e) {
        ctx.status = 500
    }
})

router.post('/api/broker/:id', async (ctx) => {
    const id = ctx.params.id
    ctx.assert(id, 400, "id must send!")
    const name = ctx.request.body.name
    ctx.assert(name, 400, "name must send!")
    const URL = ctx.request.body.URL || 'http://localhost:8080'
    try {
        const t = await request
            .post(`/group/${id}`)
            .use(prefix)
            .send({name,URL})
        ctx.status = 200
        ctx.body = t.body
    } catch (e) {
        ctx.status = 500
    }
})

router.get('/api/broker/:id', async (ctx) => {
    const id = ctx.params.id
    ctx.assert(id, 400, "id must send!")
    const limit = ctx.query.limit || 100
    try {
        const t = await request
            .get(`/group/${id}?limit=${limit}`)
            .use(prefix)
        ctx.body = {groups: t.body}
    } catch (e) {
        ctx.status = e.status
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
