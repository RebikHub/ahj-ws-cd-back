module.exports = class Instance {
    constructor() {
        this.instances = [{
            id: 'example-id',
            state: 'example-state'
        }];
    }

    create(id) {
        setTimeout(() => {
            this.instances.push({
              id: id,
              state: 'stopped',
            });
            return {
                status: 'ok',
                id: id,
                info: 'Server create',
              }
          }, 20000);
    }

    start(id) {
        setTimeout(() => {
            instances.push({
              id: id,
              state: 'running',
            });
          }, 20000);
        
          ctx.response.body = {
            status: 'ok',
            id: id,
            info: `Recieved: Server is being started...`
          }
    }

    stop(id) {
        setTimeout(() => {
            instances.push({
              id: id,
              state: 'stopped',
            });
          }, 20000);
        
          ctx.response.body = {
            status: 'ok',
            id: id,
            info: `Recieved: Server is being stopped...`
          }
    }
}