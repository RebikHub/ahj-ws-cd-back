const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const Router = require('koa-router');
const { v4: uuidv4 } = require('uuid');
const router = new Router();
const app = new Koa();
const Instance = require('./instanceController');
const instControl = new Instance();

app.use(koaBody({
    urlencoded: true,
    multipart: true,
    json:true,
}));

app.use(
    cors({
      origin: '*',
      credentials: true,
      'Access-Control-Allow-Origin': true,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
  )

router.get('/instances', async (ctx) => {
    ctx.response.body = instControl.instances;
});

router.post('/instances', async (ctx) => {
    const method = ctx.request.body;
    console.log(method);
    switch (method) {
        case 'create':
        const id = uuidv4();
        // ctx.response.body = instControl.create(id);
        setTimeout(() => {
            instControl.instances.push({
              id: id,
              state: 'stopped',
            });
            console.log('createed ok');
            ctx.response.body = {
                status: 'ok',
                id: id,
                info: 'Server create',
              }
          }, 20000);
        ctx.response.body = {
            status: 'ok',
            id: id,
            info: 'Recieved: Server is being created...',
        }
        break;
        case 'start': ctx.response.body = instControl.start(id);
        break;
        case 'stop': ctx.response.body = instControl.stop(id);
        break;
        default:
        ctx.response.status = 400;
        ctx.response.body = `Unknown command '${method}'`;
    }
});

  // app.use(async (ctx) => {
//     let method;
//     if (ctx.request.method === 'GET') ({ method } = ctx.request.query);
//     else if (ctx.request.method === 'POST') ({ method } = ctx.request.body);
  
//       ctx.response.status = 200;
      
//     switch (method) {
//       case 'allTickets': ctx.response.body = ticketController.getTickets();
//         break;
//       case 'ticketById': ctx.response.body = ticketController.getTicketById(ctx.request.query);
//         break;
//       case 'createTicket': ctx.response.body = ticketController.createTicket(ctx.request.body);
//         break;
//       case 'changeStatus': ctx.response.body = ticketController.changeStatus(ctx.request.body);
//         break;
//       case 'updateTicket': ctx.response.body = ticketController.updateTicket(ctx.request.body);
//         break;
//       case 'deleteTicket': ctx.response.body = ticketController.deleteTicket(ctx.request.body);
//         break;
//       default:
//         ctx.response.status = 400;
//         ctx.response.body = `Unknown method '${method}' in request parameters`;
//     }
//   });

router.delete('/intsances/:id', async (ctx) => {
    const index = instControl.instances.findIndex((elem) => elem.id === ctx.params.id);
    if (index !== -1) {
        instControl.instances.splice(index, 1);
    };
    ctx.response.status=204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3333;

app.listen(port, () => console.log('Server started'));
