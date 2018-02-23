const Koa = require('koa')
const Router = require('koa-router')
const request = require('superagent');
const prefix = require('superagent-prefix')('http://localhost:8181/api');
const app = new Koa()
const router = new Router()
// const asyncBusboy = require('async-busboy')

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


router.post('/api/actuator/:id', async (ctx) => {
    const id = ctx.params.id
    ctx.assert(id, 400, "Actuator id is required!")

    const code  = ctx.request.body.code
    const config  = ctx.request.body.config
    ctx.assert(code && config,"body is not complete!")
    try {
        const t = await request
            .post(`/actuator/${id}`)
            .use(prefix)
            .field("code",code)
            .field("config",config)
        ctx.status = 204
    } catch (e) {
        ctx.status = e.status
        ctx.body = e.response.text
    }
})

router.post('/api/actuator/:id/trigger', async (ctx) => {
    const id = ctx.params.id
    ctx.assert(id, 400, "Actuator id is required!")

    const action  = ctx.request.body.action
    try {
        const t = await request
            .post(`/actuator/${id}/trigger`)
            .use(prefix)
            .field("action",action)
        ctx.status = 200
        ctx.body = t.body
    } catch (e) {
        ctx.status = e.status
        ctx.body = e.response.text
    }
})



app.use(router.routes())

module.exports = app
