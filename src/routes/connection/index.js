const Koa = require('koa')
const Router = require('koa-router')
const request = require('superagent');
const sensorPrefix = require('superagent-prefix')('http://localhost:8080/api');
const actuatorPrefix = require('superagent-prefix')('http://localhost:8181/api');
const brokerPrefix = require('superagent-prefix')('http://localhost:1375/api');
const app = new Koa()
const router = new Router()

router.get('/api/check', async (ctx) => {
    try {
        const t = await request
            .get('/about')
            .use(sensorPrefix)
        console.log('sensor is up :)')
        ctx.body = {groups: t.body}
    } catch (e) {
        console.log('sensor is down :(')
        ctx.status = 500
        ctx.body = {fault: "sensor"}
        return
    }

    try {
        const t = await request
            .get('/about')
            .use(actuatorPrefix)
        console.log('actuator is up :)')
        ctx.body = {groups: t.body}
    } catch (e) {
        console.log('actuator is down :(')
        ctx.status = 500
        ctx.body = {fault: "actuator"}
        return
    }

    try {
        const t = await request
            .get('/about')
            .use(brokerPrefix)
        console.log('broker is up :)')
        ctx.body = {groups: t.body}
    } catch (e) {
        console.log('broker is down :(')
        ctx.status = 500
        ctx.body = {fault: "broker"}
        return
    }

    ctx.status = 200
    ctx.body = "ok"
})


app.use(router.routes())
module.exports = app
