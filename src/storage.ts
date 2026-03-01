/**
 * Log Storage — Persistent log retrieval and management
 */
import { LogEntry, LogLevel } from './logger';

export class LogStorage {
    /** Get all persisted logs */
    static async getAll(): Promise<LogEntry[]> {
        const result = await chrome.storage.local.get('__log_entries__');
        return (result.__log_entries__ as LogEntry[]) || [];
    }

    /** Get logs filtered by level */
    static async getByLevel(level: LogLevel): Promise<LogEntry[]> {
        const all = await this.getAll();
        return all.filter((e) => e.level === level);
    }

    /** Get logs from last N minutes */
    static async getRecent(minutes: number = 30): Promise<LogEntry[]> {
        const cutoff = Date.now() - minutes * 60000;
        const all = await this.getAll();
        return all.filter((e) => e.timestamp >= cutoff);
    }

    /** Get logs by context */
    static async getByContext(context: string): Promise<LogEntry[]> {
        const all = await this.getAll();
        return all.filter((e) => e.context?.startsWith(context));
    }

    /** Clear all stored logs */
    static async clear(): Promise<void> { await chrome.storage.local.remove('__log_entries__'); }

    /** Get log count by level */
    static async getCounts(): Promise<Record<LogLevel, number>> {
        const all = await this.getAll();
        return { debug: all.filter((e) => e.level === 'debug').length, info: all.filter((e) => e.level === 'info').length, warn: all.filter((e) => e.level === 'warn').length, error: all.filter((e) => e.level === 'error').length };
    }
}
