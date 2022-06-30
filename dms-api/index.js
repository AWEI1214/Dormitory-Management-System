const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser')
const urls = require('./urls.js');
const clr = require('./controller.js');
const define = require("./define.js");

// 跨域
app.use(
  cors({
    origin: function (ctx) {
      return 'http://localhost:8080';
    },
    maxAge: 5, 
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
  })
);
app.use(bodyParser())

const URLS = [
  urls.LOG_IN, urls.SIGN_UP, urls.EDIT_USER_INFO, urls.CHANGE_PASSWD,
  urls.GET_COUNT, urls.SEARCH_DATA, urls.DELETE_DATA, urls.RESET_PASSWORD,
  urls.UPDATE_DATA, urls.INSERT_DATA, urls.GET_DATA, urls.GET_GROUP
];

const CONTROLLERS = [
  clr.LOG_IN, clr.SIGN_UP, clr.EDIT_USER_INFO, clr.CHANGE_PASSWD,
  clr.GET_COUNT, clr.SEARCH_DATA, clr.DELETE_DATA, clr.RESET_PASSWORD,
  clr.UPDATE_DATA, clr.INSERT_DATA, clr.GET_DATA, clr.GET_GROUP
];
for(let i = 0;i<URLS.length;i++){
  router.post(define.ADDR_PREV + URLS[i], CONTROLLERS[i]);
}

app.use(async (ctx, next) => {
  await next();
  // console.log(`${ctx.header['X-Real-Ip'] || ctx.ip} ${ctx.header["sec-ch-ua"] || ctx.header["X-Forwarded-Scheme"]} ${ctx.header['sec-ch-ua-platform']} ${ctx.method} ${ctx.url}`);
  console.log(`${JSON.stringify(ctx.header)} ${ctx.method} ${ctx.url}`);
});

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000);