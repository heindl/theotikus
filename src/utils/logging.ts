// tslint:disable:no-this no-expression-statement

/**
 * A basic interface for recieving formatted logs, intended for either the console or a remote logging service.
 */
interface IExternalLogHandler {
    // tslint:disable:readonly-array
    readonly log: (m: string, ..._: any[]) => void;
    readonly error: (m: string, ..._: any[]) => void;
}

/**
 * Setting for logging levels, where 0 [Debug] prints everything and 3 [Error] only records errors.
 */
export enum LogLevel {
    Debug = 0,
    Info,
    Warn,
    Error
}

/**
 * Small example logger that can incorporate external sources via an interface.
 */
// tslint:disable:no-class
export class Logger {
    private readonly handler: IExternalLogHandler;
    private readonly minimumLevel: LogLevel;
    constructor(handler: IExternalLogHandler, level: LogLevel = 1) {
        this.handler = handler;
        this.minimumLevel = level;
    }

    public readonly Debug = (message: string): void => {
        // tslint:disable:no-unused-expression
        this.minimumLevel <= LogLevel.Debug &&
        this.handler.log(`Debug: ${message}`);
    };

    public readonly Info = (message: string): void => {
        // tslint:disable:no-unused-expression
        this.minimumLevel <= LogLevel.Info && this.handler.log(`Info: ${message}`);
    };

    public readonly Warning = (message: string): void => {
        // tslint:disable:no-unused-expression
        this.minimumLevel <= LogLevel.Warn &&
        this.handler.log(`Warning: ${message}`);
    };

    public readonly Error = (message: string): void => {
        // tslint:disable:no-unused-expression
        this.minimumLevel <= LogLevel.Error && this.handler.error(`${message}`);
    };
}

export const GlobalLogger = new Logger(console);

