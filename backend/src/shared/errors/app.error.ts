export class AppError extends Error {
  protected statusCode: number
  protected code: string
  protected previousError: Error | null
  protected shouldPrintInConsole: boolean

  constructor(message: string, statusCode: number, previousError?: Error, code = "APP_ERROR") {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.previousError = previousError ?? null
    this.shouldPrintInConsole = true
  }

  public getStatusCode(): number {
    return this.statusCode
  }

  public getPrevious() {
    return this.previousError
  }

  public getCode() {
    return this.code
  }

  public getShouldPrintInConsole() {
    return this.shouldPrintInConsole
  }
}
