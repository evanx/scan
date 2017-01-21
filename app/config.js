
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
            default: 'info',
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
