
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
            await Promise.map(result[1], async key => {
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
