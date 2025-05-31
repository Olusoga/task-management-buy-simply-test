import {utilities as nestWinstonModuleUtilities} from 'nest-winston';
import * as winston from 'winston';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      nestWinstonModuleUtilities.format.nestLike('ImmigrationBrief', {
        prettyPrint: true,
      }),
    ),
  }),
  new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
];

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.json(),
  ),
  transports,
});
