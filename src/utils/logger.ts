import pino from 'pino';
import dayjs from 'dayjs';

// Create a Pino logger instance
const logger = pino({
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format('MM-DD HH:mm:ss')}"`,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});

export default logger;
