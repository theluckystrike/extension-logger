# extension-logger

[![npm version](https://img.shields.io/npm/v/extension-logger)](https://www.npmjs.com/package/extension-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Last commit](https://img.shields.io/github/last-commit/theluckystrike/extension-logger)](https://github.com/theluckystrike/extension-logger/commits/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)

Structured logging for Chrome extensions — log levels, namespaces, persistence, export, and performance timing. Zero dependencies.

## Features

- **Log Levels**: `debug`, `info`, `warn`, `error` with configurable minimum level
- **Namespaces**: Scoped logging with hierarchical child loggers for modular code
- **Context Tags**: Hierarchical context prefixes for filtering and organization
- **Persistence**: Automatic storage to `chrome.storage.local`
- **Export**: Download logs as JSON, CSV, or plain text
- **Performance Timer**: Built-in timing utilities for measuring execution
- **Colored Console**: Pretty-printed output with consistent styling
- **Performance-Safe**: Buffered logging with automatic size limits

## Installation

```bash
npm install extension-logger
```

Or with yarn:

```bash
yarn add extension-logger
```

## Why extension-logger?

Building Chrome extensions requires careful logging strategies. Console logs disappear when users close DevTools, and browser storage has quotas. extension-logger solves these problems by providing:

1. **Persistent logs** — Store logs to `chrome.storage.local` for later retrieval
2. **Structured data** — Each log entry includes level, message, context, data, and timestamp
3. **Namespace support** — Create child loggers for different modules with hierarchical contexts
4. **Export capabilities** — Download logs as JSON, CSV, or text for debugging
5. **Performance monitoring** — Built-in timing utilities to identify slow operations

## Usage

### Basic Logger

```typescript
import { Logger } from 'extension-logger';

const logger = new Logger('my-extension');

logger.info('Application started');
logger.warn('Using deprecated API');
logger.error('Failed to load data', { error });
```

### Log Levels

```typescript
const logger = new Logger('app', { minLevel: 'debug' });

logger.debug('Debug information');   // 🔍 [app] Debug information
logger.info('Normal operation');      // ℹ️ [app] Normal operation
logger.warn('Warning message');      // ⚠️ [app] Warning message
logger.error('Error occurred');       // ❌ [app] Error occurred
```

### Namespaces and Child Loggers

Create scoped child loggers for different modules. Each child inherits the parent's configuration:

```typescript
const logger = new Logger('my-extension');

// Create child loggers for different modules
const authLogger = logger.child('auth');
const apiLogger = logger.child('api');
const uiLogger = logger.child('ui');

// Even deeper nesting
const formLogger = uiLogger.child('forms');

authLogger.info('User authenticated');     // [my-extension:auth] User authenticated
apiLogger.warn('Rate limited');            // [my-extension:api] Rate limited
formLogger.debug('Form validation failed'); // [my-extension:ui:forms] Form validation failed
```

### Structured Output

Pass additional data as the second argument for structured logging:

```typescript
logger.info('User logged in', { userId: '12345', method: 'oauth' });
logger.error('Request failed', { url: '/api/users', status: 500, retry: true });
```

### Custom Formatters

You can customize how logs appear in the console by extending the Logger:

```typescript
import { Logger, LogEntry } from 'extension-logger';

class CustomFormatter extends Logger {
    private formatMessage(entry: LogEntry): string {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        const level = entry.level.toUpperCase().padEnd(5);
        return `[${time}] [${level}] ${entry.message}`;
    }

    // Override log method to customize output
    log(level: string, message: string, data?: unknown): void {
        const entry: LogEntry = {
            level: level as any,
            message,
            context: this['context'],
            data,
            timestamp: Date.now()
        };
        console.log(this.formatMessage(entry), data || '');
    }
}
```

### Persisting Logs to Storage

Enable persistence to store logs in `chrome.storage.local`:

```typescript
const logger = new Logger('my-extension', { persist: true });

// Logs are automatically saved to chrome.storage.local
logger.info('User logged in', { userId: '12345' });
```

### Retrieving Stored Logs

```typescript
import { LogStorage } from 'extension-logger';

// Get all stored logs
const allLogs = await LogStorage.getAll();

// Get logs by level
const errors = await LogStorage.getByLevel('error');

// Get recent logs (last 30 minutes)
const recent = await LogStorage.getRecent(30);

// Get logs by context prefix
const authLogs = await LogStorage.getByContext('my-extension:auth');

// Get count by level
const counts = await LogStorage.getCounts();
// { debug: 10, info: 50, warn: 5, error: 2 }

// Clear all logs
await LogStorage.clear();
```

### Exporting Logs

```typescript
import { Logger, LogStorage, LogExporter } from 'extension-logger';

// Get logs from storage
const logs = await LogStorage.getRecent(60);

// Export as JSON file (triggers download)
LogExporter.exportJSON(logs, 'my-logs.json');

// Get as plain text
const text = LogExporter.toText(logs);
console.log(text);
// 2024-03-07T10:30:00.000Z [INFO] [my-extension] User logged in | {"userId":"12345"}

// Get as CSV
const csv = LogExporter.toCSV(logs);
```

### Performance Timer

```typescript
import { Logger, PerfTimer } from 'extension-logger';

const logger = new Logger('perf');
const timer = new PerfTimer(logger);

// Simple timing
timer.start('fetch-data');
await fetchData();
timer.end('fetch-data'); // Logs: "ℹ️ [perf] fetch-data: 123.45ms" with { label, durationMs: 123.45 }

// Measure function execution
await timer.measure('async-operation', async () => {
  // Your async code here
});

// Check active timers
const active = timer.getActive();
```

### Console Transport

By default, logs are output to the browser console with colored formatting:

| Level  | Color   | Icon |
|--------|---------|------|
| debug  | Gray    | 🔍   |
| info   | Blue    | ℹ️   |
| warn   | Yellow  | ⚠️   |
| error  | Red     | ❌   |

### Storage Transport

Enable the storage transport by setting `persist: true`:

```typescript
const logger = new Logger('app', { persist: true });
```

Logs are stored in `chrome.storage.local` with automatic size limiting (max 500 entries).

### Remote Transport (Extensible)

The library is designed to be extensible. You can create a custom transport for remote logging:

```typescript
import { Logger, LogEntry } from 'extension-logger';

class RemoteLogger extends Logger {
    private async sendToRemote(entry: LogEntry): Promise<void> {
        try {
            await fetch('https://your-api.com/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
        } catch (e) {
            // Fallback to console if remote fails
            console.error('Failed to send log to remote:', e);
        }
    }

    // Override to add remote transport
    debug(message: string, data?: unknown): void {
        super.debug(message, data);
        this.sendToRemote({
            level: 'debug',
            message,
            context: this['context'],
            data,
            timestamp: Date.now()
        });
    }
}

const logger = new RemoteLogger('app');
logger.info('This will also be sent to remote');
```

## Performance-Safe Logging

extension-logger is designed to minimize performance impact in production:

### Buffer Management

- **In-memory buffer**: Maximum 1000 entries per logger instance
- **Storage buffer**: Maximum 500 entries in chrome.storage.local
- **Automatic cleanup**: Old entries are automatically removed when limits are reached

### Best Practices

```typescript
// Use appropriate log levels in production
const logger = new Logger('app', { 
    minLevel: 'warn'  // Only warn and error in production
});

// Disable persistence in production if not needed
const logger = new Logger('app', { 
    persist: process.env.NODE_ENV !== 'production'
});

// Use child loggers for modules to avoid context string overhead
const moduleLogger = logger.child('module');
moduleLogger.debug('Debug info'); // Faster than logger.debug('[module] ...')
```

### Timing Overhead

The PerfTimer uses `performance.now()` for accurate timing with minimal overhead:

```typescript
const timer = new PerfTimer(logger);
// Start and end are designed to have < 1ms overhead
timer.start('operation');
// ... your code ...
timer.end('operation');
```

## API Reference

### Logger

```typescript
new Logger(context: string, options?: { minLevel?: LogLevel; persist?: boolean })
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `context` | `string` | `'app'` | Logger identifier, used as prefix in all log messages |
| `minLevel` | `LogLevel` | `'debug'` | Minimum log level to output |
| `persist` | `boolean` | `false` | Whether to persist logs to chrome.storage.local |

**Methods**

| Method | Description |
|--------|-------------|
| `debug(message, data?)` | Log at debug level |
| `info(message, data?)` | Log at info level |
| `warn(message, data?)` | Log at warn level |
| `error(message, data?)` | Log at error level |
| `child(context)` | Create child logger with scoped context |
| `getEntries()` | Get all buffered log entries |
| `clear()` | Clear the internal buffer |

### LogStorage (Static)

| Method | Description |
|--------|-------------|
| `getAll()` | Get all persisted logs |
| `getByLevel(level)` | Get logs filtered by level |
| `getRecent(minutes)` | Get logs from last N minutes |
| `getByContext(context)` | Get logs by context prefix |
| `clear()` | Clear all stored logs |
| `getCounts()` | Get count of logs by level |

### LogExporter (Static)

| Method | Description |
|--------|-------------|
| `exportJSON(entries, filename?)` | Download logs as JSON file |
| `toText(entries)` | Convert to plain text |
| `toCSV(entries)` | Convert to CSV format |

### PerfTimer

```typescript
new PerfTimer(logger?: Logger)
```

| Method | Description |
|--------|-------------|
| `start(label)` | Start a named timer |
| `end(label)` | End timer and log duration |
| `measure(label, fn)` | Measure async function execution |
| `getActive()` | Get list of active timer labels |

### Types

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    context?: string;
    data?: unknown;
    timestamp: number;
}

interface LoggerOptions {
    minLevel?: LogLevel;
    persist?: boolean;
}
```

## Project Structure

```
extension-logger/
├── src/
│   ├── index.ts      # Main entry point, exports all public APIs
│   ├── logger.ts     # Logger class with levels, context, persistence
│   ├── storage.ts   # LogStorage for retrieving persisted logs
│   ├── exporter.ts  # LogExporter for JSON/CSV/text export
│   └── perf.ts      # PerfTimer for measuring execution time
├── package.json     # npm package configuration
├── tsconfig.json    # TypeScript configuration
├── jest.config.js   # Jest test configuration
├── LICENSE          # MIT license
└── README.md        # This file
```

## Building

```bash
npm install
npm run build
```

## Testing

```bash
npm test
```

## Requirements

- Chrome extension environment with access to `chrome.storage` API
- TypeScript 5.3.3 or later for development

## Browser Compatibility

- Chrome 88+ (Manifest V3)
- Edge 88+
- Any Chromium-based browser with chrome.storage API

---

Built with ❤️ by [Zovo](https://zovo.one) — Crafting tools for modern Chrome extensions.

<a href="https://zovo.one">
  <img src="https://zovo.one/logo.svg" alt="Zovo" width="100" />
</a>

[theluckystrike](https://github.com/theluckystrike) · [GitHub](https://github.com/theluckystrike/extension-logger) · [npm](https://www.npmjs.com/package/extension-logger)
