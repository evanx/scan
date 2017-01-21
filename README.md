# scan

Containerized utility to scan Redis keys, using Node.js

## Config

See app/config.js
```javascript
module.exports = {
    development: {
        logging: 'debug',
        pattern: '*',
        format: 'verbose'
    },
    help: {
        info: {
            default: 'verbose',
            options: ['terse', 'verbose'],
            description: 'display configuration defaults'
        },
        redisUrl: {
            default: 'redis://localhost:6379'
        },
        logging: {
            default: 'info'
        },
        pattern: {
            description: 'matching pattern for Redis scan'
        },
        format: {
            default: 'terse',
            options: ['terse', 'verbose']
        }
    }
};
```
where the default `redisUrl` is `'redis://localhost:6379'`

## Implementation

See app/index.js
```javascript
require('../components/redisCliApp')(require('./config')).then(main);

async function main(context) {
    Object.assign(global, context);
    logger.level = config.logging;
    logger.debug('main', config);
    try {
        let cursor;
        while (cursor !== 0) {
            const [result] = await multiExecAsync(client, multi => {
                multi.scan(cursor || 0, 'match', config.pattern);
            });
            cursor = parseInt(result[0]);
            result[1].forEach(key => {
                console.log(key);
            });
        }
    } catch (err) {
        console.error(err);
    } finally {
        end();
    }
}

async function end() {
    client.quit();
}
```

## Docker

### Build and run

```shell
docker build -t scan https://github.com/evanx/scan.git
```
where tagged as image `scan` 

```shell
docker run --network=host -e pattern='authbot:*' scan
```
where `--network-host` connects to `localhost` bridge so that the default `redisUrl` of `redis://localhost:6379` works in that case.

As such, you should inspect the source:
```shell
git clone https://github.com/evanx/scan.git
cd scan
cat Dockerfile 
```
```
FROM node:7.4.0
ADD package.json .
RUN npm install
ADD components components
ADD app app
ENV NODE_ENV production
CMD ["node", "--harmony", "app/index.js"]
```

Having reviewed the code, you can execute as follows:
```
npm install
pattern='*' npm start
```

https://twitter.com/@evanxsummers
