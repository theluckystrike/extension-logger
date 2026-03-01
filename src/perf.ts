/**
 * Performance Timer — Measure execution time with structured output
 */
import { Logger } from './logger';

export class PerfTimer {
    private logger: Logger;
    private timers = new Map<string, number>();

    constructor(logger?: Logger) { this.logger = logger || new Logger('perf'); }

    /** Start a timer */
    start(label: string): void { this.timers.set(label, performance.now()); }

    /** End a timer and log the duration */
    end(label: string): number {
        const start = this.timers.get(label);
        if (!start) { this.logger.warn(`Timer "${label}" was never started`); return 0; }
        const duration = performance.now() - start;
        this.timers.delete(label);
        this.logger.info(`${label}: ${duration.toFixed(2)}ms`, { label, durationMs: duration });
        return duration;
    }

    /** Measure a function's execution time */
    async measure<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
        this.start(label);
        const result = await fn();
        this.end(label);
        return result;
    }

    /** Get all active timers */
    getActive(): string[] { return Array.from(this.timers.keys()); }
}
