/**
 * Log Exporter — Export logs as file or text
 */
import { LogEntry } from './logger';

export class LogExporter {
    /** Export as JSON file */
    static exportJSON(entries: LogEntry[], filename: string = 'extension-logs.json'): void {
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    }

    /** Export as readable text */
    static toText(entries: LogEntry[]): string {
        return entries.map((e) => {
            const time = new Date(e.timestamp).toISOString();
            const data = e.data ? ` | ${JSON.stringify(e.data)}` : '';
            return `[${time}] [${e.level.toUpperCase()}] [${e.context}] ${e.message}${data}`;
        }).join('\n');
    }

    /** Export as CSV */
    static toCSV(entries: LogEntry[]): string {
        const header = 'timestamp,level,context,message,data';
        const rows = entries.map((e) =>
            `"${new Date(e.timestamp).toISOString()}","${e.level}","${e.context}","${e.message.replace(/"/g, '""')}","${e.data ? JSON.stringify(e.data).replace(/"/g, '""') : ''}"`
        );
        return [header, ...rows].join('\n');
    }
}
