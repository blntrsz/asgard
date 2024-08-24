import { Logger } from '../ports/logger';
import pino from 'pino';

const logger = pino();

export class PinoLogger implements Logger {
  constructor() {}

  setup() {}

  info(msg: string): void {
    logger.info(msg);
  }
  debug(msg: string): void {
    logger.debug(msg);
  }
  warn(msg: string): void {
    logger.warn(msg);
  }
  error(msg: string): void {
    logger.error(msg);
  }
}
