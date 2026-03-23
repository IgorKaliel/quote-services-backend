import { AppError } from './app.error.ts';

export class UnauthenticatedError extends AppError {
  constructor(message: string = 'Unauthorized.') {
    super(message, 401, undefined, "UNAUTHENTICATED");
    this.shouldPrintInConsole = false;
  }
}
