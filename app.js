const Koa = require('koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const Router = require('koa-router');
const { User } = require('./db');
const fs = require('fs');
const parser = require('koa-parser');

const app = new Koa();
const router = new Router();

router.post("/register.html", async (ctx, next) => {
  if (ctx.request.body !== undefined) {
    let name = ctx.request.body.userName;
    let gmail = ctx.request.body.mail;
    let pas = ctx.request.body.password1;
    let col = await User.findAll();
    let mails = [];
    for(let i=0; i<col.length;i++){
    mails[i] = col[i].mail;
    console.log(col[i].mail);
    }
    console.log(mails);
    let txt = "<!DOCTYPE html><html><head><title>Users</title></head><body><a href=\"http://localhost:3000/index.html\"><b>Главная</b></href></a><br><br>";
    if(mails.indexOf(gmail)==-1){
      User.create({ name: name, mail: gmail, password: pas});
      txt += "<p>Спасибо за регистрацию</p></body></html>";
      ctx.body = txt;
    }
    else {
      txt += "<p>Пользователь с таким e-mail уже зарегистрирован</p></body></html>"
      ctx.body = txt;
    }
  }
await next()
});

router.get("/deleteusers", async ctx => {
  let col = await User.findAll();
  
for(let i=0; i<100; i++){
  User.destroy({
  where: {
  id: i
  }
}).then(() => {
 console.log(`${col[i].name} deleted`);
  });
}
      console.log("Done");
});

router.get('/users', async ctx => {
  let collection = await User.findAll({
  attributes: ['name', 'mail']
});
  let restxt = fs.readFileSync(__dirname + '/public/regusers.html', 'utf8')
  for(let i=0; i<collection.length;i++){
    restxt += "<tr><td width=\"250px\">" + collection[i].name + "</td><td width=\"250px\">" + collection[i].mail + "</td></tr>"
  }
  restxt += "</tbody></table><br><br></body></html>";
  ctx.body = restxt;
})

app
  .use(logger())
  .use(parser())
  .use(serve('public'))
  .use(router.routes())
  .listen(3000);
