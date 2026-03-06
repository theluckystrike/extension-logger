# extension-logger

Structured logging for Chrome extensions with log levels, context tags, storage persistence, export capabilities, and performance timing. Zero dependencies.

## Features

- Log levels: debug, info, warn, error
- Context-based logging with scoped child loggers
- Optional storage persistence using chrome.storage.local
- Export logs as JSON, CSV, or plain text
- Built-in performance timer for measuring execution time
- Colored console output with consistent styling

## Installation

```bash
npm install extension-logger
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

logger.debug('Debug information');
logger.info('Normal operation');
logger.warn('Warning message');
logger.error('Error occurred');
```

### Persisting Logs to Storage

```typescript
const logger = new Logger('my-extension', { persist: true });

// Logs will be stored in chrome.storage.local
logger.info('User logged in', { userId: '12345' });
```

### Child Loggers

```typescript
const logger = new Logger('app');
const childLogger = logger.child('auth');

childLogger.info('User authenticated'); // Logs with context "app:auth"
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

// Export as JSON file
LogExporter.exportJSON(logs, 'my-logs.json');

// Get as plain text
const text = LogExporter.toText(logs);

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
timer.end('fetch-data'); // Logs: "fetch-data: 123.45ms"

// Measure function execution
await timer.measure('async-operation', async () => {
  // Your async code here
});
```

## API Reference

### Logger

```typescript
new Logger(context: string, options?: { minLevel?: LogLevel; persist?: boolean })
```

- `context` - Logger identifier, used as prefix in all log messages
- `minLevel` - Minimum log level to output (default: 'debug')
- `persist` - Whether to persist logs to chrome.storage.local (default: false)

**Methods**
- `debug(message: string, data?: unknown)` - Log at debug level
- `info(message: string, data?: unknown)` - Log at info level
- `warn(message: string, data?: unknown)` - Log at warn level
- `error(message: string, data?: unknown)` - Log at error level
- `child(context: string)` - Create child logger with scoped context
- `getEntries()` - Get all buffered log entries
- `clear()` - Clear the internal buffer

### LogStorage (Static)

- `getAll()` - Get all persisted logs
- `getByLevel(level: LogLevel)` - Get logs filtered by level
- `getRecent(minutes: number)` - Get logs from last N minutes
- `getByContext(context: string)` - Get logs by context prefix
- `clear()` - Clear all stored logs
- `getCounts()` - Get count of logs by level

### LogExporter (Static)

- `exportJSON(entries: LogEntry[], filename?: string)` - Download as JSON file
- `toText(entries: LogEntry[])` - Convert to plain text
- `toCSV(entries: LogEntry[])` - Convert to CSV format

### PerfTimer

```typescript
new PerfTimer(logger?: Logger)
```

- `start(label: string)` - Start a named timer
- `end(label: string)` - End timer and log duration
- `measure(label: string, fn: () => T)` - Measure async function execution
- `getActive()` - Get list of active timer labels

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

## Requirements

- Chrome extension environment with access to chrome.storage API
- TypeScript 5.3.3 or later for development

## Building

```bash
npm install
npm run build
```

## Testing

```bash
npm test
```

## About

extension-logger is maintained by theluckystrike and designed for building Chrome extensions with structured logging capabilities. It provides a lightweight solution for debugging and monitoring extension behavior without external dependencies.

For questions and support, please open an issue on GitHub.
