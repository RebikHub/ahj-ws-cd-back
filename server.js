const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const Router = require('koa-router');
const { v4: uuidv4 } = require('uuid');
const { streamEvents } = require('http-event-stream');
const router = new Router();
const app = new Koa();
const instances = [{
  id: 'id',
  state: 'stopped'
}]

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
    ctx.response.body = instances;
});

// router.post('/intsances', async (ctx) => {
//     const method = ctx.request.body;
//     const instId = ctx.params.id;
//     console.log(ctx.params.id);
//     console.log(method);
//     switch (method) {
//         case 'create':
//         const id = uuidv4();
//         ctx.response.body = {
//           status: 'ok',
//           id: id,
//           info: 'Recieved: Server is being created...',
//         };
//         instances.push({
//           id: id,
//           state: 'stopped',
//         });
//         break;
//         case 'start': ctx.response.body = {
//           status: 'ok',
//           id: id,
//           info: 'Recieved: Server is being started...'
//         };
//         break;
//         case 'stop': ctx.response.body = {
//           status: 'ok',
//           id: id,
//           info: 'Recieved: Server is being stopped...'
//         };
//         break;
//         case 'delete':
//           // '/intsances/:id'
//           const index = instances.findIndex((elem) => elem.id === ctx.params.id);
//           if (index !== -1) {
//             instances.splice(index, 1);
//           };

//         ctx.response.body = {
//           status: 'ok',
//           id: id,
//           info: 'Recieved: Server is being deleted...'
//         };
//         break;
//         default:
//         ctx.response.status = 400;
//         ctx.response.body = `Unknown command '${method}'`;
//     }
// });

router.get('/create', async (ctx) => {
  const id = uuidv4();
  streamEvents(ctx.req, ctx.res, {
    stream(sse) {
      sse.sendEvent({
        id: uuidv4(),
        data: JSON.stringify({
                    status: 'ok',
                    id: id,
                    info: 'Recieved: Server is being created...',
                  }),
        event: 'comment'
      });
      setTimeout(() => {
        instances.push({
          id: id,
          state: 'stopped',
        });
        sse.sendEvent({
          id: uuidv4(),
          data: JSON.stringify({INFO: 'Server create'}),
          event: 'comment'
        });
      }, 5000);
    }
  });

  // ctx.req.on('close', () => {
  //   // ctx.res.end()
  //   console.log('Client closed the connection.')
  //   })
  ctx.respond = false;
});

router.get('/start', async (ctx) => {
  ctx.response.body = {
    status: 'ok'
  }
  streamEvents(ctx.req, ctx.res, {
    stream(sse) {
      setTimeout(() => {
        sse.sendEvent({
          id: uuidv4(),
          data: JSON.stringify({INFO: 'Server start'}),
          event: 'comment'
        });
      }, 5000);
    }
  });

  ctx.respond = false;
});

router.get('/stop', async (ctx) => {
  ctx.response.body = {
    status: 'ok'
  }
  streamEvents(ctx.req, ctx.res, {
    stream(sse) {
      setTimeout(() => {
        sse.sendEvent({
          id: uuidv4(),
          data: JSON.stringify({INFO: 'Server stop'}),
          event: 'comment'
        });
      }, 5000);
    }
  });

  ctx.respond = false;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3333;

app.listen(port, () => console.log('Server started'));
