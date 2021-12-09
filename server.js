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
          data: JSON.stringify({
            id: id,
            state: 'stopped',
            INFO: 'Server create'
          }),
          event: 'comment'
        });
      }, 20000);
    }
  });

  ctx.respond = false;
});

router.get('/start', async (ctx) => {
  const id = ctx.request.query.id;
  streamEvents(ctx.req, ctx.res, {
    stream(sse) {
      sse.sendEvent({
        id: uuidv4(),
        data: JSON.stringify({
                    status: 'ok',
                    id: id,
                    info: 'Recieved: Server is being started...'
                  }),
        event: 'comment'
      });
      setTimeout(() => {
        instances.forEach(elem => {
          if (elem.id === id) {
            elem.state = 'running';
          }
        })
        sse.sendEvent({
          id: uuidv4(),
          data: JSON.stringify({
            id: id,
            state: 'running',
            INFO: 'Server start'
          }),
          event: 'comment'
        });
      }, 20000);
    }
  });

  ctx.respond = false;
});

router.get('/stop', async (ctx) => {
  const id = ctx.request.query.id;
  streamEvents(ctx.req, ctx.res, {
    stream(sse) {
      sse.sendEvent({
        id: uuidv4(),
        data: JSON.stringify({
                    status: 'ok',
                    id: id,
                    info: 'Recieved: Server is being stopped...'
                  }),
        event: 'comment'
      });
      setTimeout(() => {
        instances.forEach(elem => {
          if (elem.id === id) {
            elem.state = 'stopped';
          }
        })
        sse.sendEvent({
          id: uuidv4(),
          data: JSON.stringify({
            id: id,
            state: 'stopped',
            INFO: 'Server stop'
          }),
          event: 'comment'
        });
      }, 20000);
    }
  });

  ctx.respond = false;
});

router.get('/delete', async (ctx) => {
  const id = ctx.request.query.id;
  streamEvents(ctx.req, ctx.res, {
    stream(sse) {
      sse.sendEvent({
        id: uuidv4(),
        data: JSON.stringify({
                    status: 'ok',
                    id: id,
                    info: 'Recieved: Server is being deleted...'
                  }),
        event: 'comment'
      });
      setTimeout(() => {
        let index;
        instances.forEach((elem, i) => {
          if (elem.id === id) {
            index = i;
          }
        })
        instances.splice(index, 1);
        sse.sendEvent({
          id: uuidv4(),
          data: JSON.stringify({
            id: id,
            INFO: 'Server delete'
          }),
          event: 'comment'
        });
      }, 20000);
    }
  });

  ctx.respond = false;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3333;

app.listen(port, () => console.log('Server started'));
