# extension-logger

[![npm version](https://img.shields.io/npm/v/extension-logger)](https://www.npmjs.com/package/extension-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Last commit](https://img.shields.io/github/last-commit/theluckystrike/extension-logger)](https://github.com/theluckystrike/extension-logger/commits/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)

Structured logging for Chrome extensions — log levels, context tags, persistence, export, and performance timing. Zero dependencies.

## Features

- **Log Levels**: `debug`, `info`, `warn`, `error` with configurable minimum level
- **Context Tags**: Scoped logging with hierarchical child loggers
- **Persistence**: Automatic storage to `chrome.storage.local`
- **Export**: Download logs as JSON, CSV, or plain text
- **Performance Timer**: Built-in timing utilities for measuring execution
- **Colored Console**: Pretty-printed output with consistent styling

## Installation

```bash
npm install extension-logger
```

Or with yarn:

```bash
yarn add extension-logger
```

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

### Structured Output

Pass additional data as the second argument for structured logging:

```typescript
logger.info('User logged in', { userId: '12345', method: 'oauth' });
logger.error('Request failed', { url: '/api/users', status: 500, retry: true });
```

### Persisting Logs to Storage

Enable persistence to store logs in `chrome.storage.local`:

```typescript
const logger = new Logger('my-extension', { persist: true });

// Logs are automatically saved to chrome.storage.local
logger.info('User logged in', { userId: '12345' });
```

### Child Loggers

Create scoped child loggers for different modules:

```typescript
const logger = new Logger('app');
const authLogger = logger.child('auth');
const apiLogger = logger.child('api');

authLogger.info('User authenticated');  // Logs with context "app:auth"
apiLogger.warn('Rate limited');         // Logs with context "app:api"
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
const authLogs = await LogStorage.getByContext('app:auth');

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
// [2025-03-07T10:30:00.000Z] [INFO] [app] User logged in | {"userId":"12345"}

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
```

## Project Structure

```
extension-logger/
├── src/
│   ├── index.ts      # Main entry point, exports all public APIs
│   ├── logger.ts    # Logger class with levels, context, persistence
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

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
