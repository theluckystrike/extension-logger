/**
 * Logger — Structured logging with levels and context tags
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    message: string;
    context?: string;
    data?: unknown;
    timestamp: number;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const LEVEL_COLORS: Record<LogLevel, string> = { debug: '#888', info: '#4285f4', warn: '#fbbc04', error: '#ea4335' };
const LEVEL_ICONS: Record<LogLevel, string> = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' };

export class Logger {
    private context: string;
    private minLevel: LogLevel;
    private persist: boolean;
    private buffer: LogEntry[] = [];

    constructor(context: string = 'app', options?: { minLevel?: LogLevel; persist?: boolean }) {
        this.context = context;
        this.minLevel = options?.minLevel || 'debug';
        this.persist = options?.persist || false;
    }

    /** Log at debug level */
    debug(message: string, data?: unknown): void { this.log('debug', message, data); }

    /** Log at info level */
    info(message: string, data?: unknown): void { this.log('info', message, data); }

    /** Log at warn level */
    warn(message: string, data?: unknown): void { this.log('warn', message, data); }

    /** Log at error level */
    error(message: string, data?: unknown): void { this.log('error', message, data); }

    /** Create a child logger with a scoped context */
    child(childContext: string): Logger {
        return new Logger(`${this.context}:${childContext}`, { minLevel: this.minLevel, persist: this.persist });
    }

    /** Get all buffered entries */
    getEntries(): LogEntry[] { return [...this.buffer]; }

    /** Clear buffer */
    clear(): void { this.buffer = []; }

    private log(level: LogLevel, message: string, data?: unknown): void {
        if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.minLevel]) return;

        const entry: LogEntry = { level, message, context: this.context, data, timestamp: Date.now() };
        this.buffer.push(entry);
        if (this.buffer.length > 1000) this.buffer.shift();

        // Console output
        const style = `color:${LEVEL_COLORS[level]};font-weight:bold`;
        const prefix = `${LEVEL_ICONS[level]} [${this.context}]`;
        if (data !== undefined) {
            console.log(`%c${prefix} ${message}`, style, data);
        } else {
            console.log(`%c${prefix} ${message}`, style);
        }

        // Persist to storage if enabled
        if (this.persist) {
            this.persistEntry(entry);
        }
    }

    private async persistEntry(entry: LogEntry): Promise<void> {
        try {
            const result = await chrome.storage.local.get('__log_entries__');
            const entries = (result.__log_entries__ as LogEntry[]) || [];
            entries.push(entry);
            if (entries.length > 500) entries.splice(0, entries.length - 500);
            await chrome.storage.local.set({ __log_entries__: entries });
        } catch { /* Storage may not be available in all contexts */ }
    }
}
