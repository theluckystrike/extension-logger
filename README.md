# extension-logger

Structured logging utility for Chrome extensions.

## Overview

extension-logger provides a structured logging solution for Chrome extensions with log levels, formatting, and optional remote transport support.

## Installation

```bash
npm install extension-logger
```

## Usage

### Basic Logging

```javascript
import { Logger } from 'extension-logger';

const logger = new Logger('my-extension');

logger.info('Application started');
logger.warn('Using deprecated API');
logger.error('Failed to load data', { error });
```

### Log Levels

```javascript
import { Logger, levels } from 'extension-logger';

const logger = new Logger('app', {
  level: levels.DEBUG,  // Set minimum log level
});

// Different levels
logger.trace('Detailed trace info');
logger.debug('Debug information');
logger.info('Normal operation');
logger.warn('Warning message');
logger.error('Error occurred');
logger.fatal('Critical failure');
```

### With Context

```javascript
const logger = new Logger('my-extension');

logger.info('User logged in', {
  userId: '12345',
  email: 'user@example.com',
  timestamp: new Date().toISOString(),
});
```

### Browser Extension Specific

```javascript
import { Logger } from 'extension-logger';

// Logs to console and optionally to background storage
const logger = new Logger('popup', {
  background: true,  // Also log to background script
  maxEntries: 100,  // Keep last 100 logs in storage
});

// In popup/options/background scripts
logger.info('Popup opened');
```

## API

### Logger Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| name | string | required | Logger name/prefix |
| level | Level | INFO | Minimum log level |
| background | boolean | false | Log to background storage |
| maxEntries | number | 100 | Max logs to store |

### Log Levels

- `levels.TRACE` - Most verbose
- `levels.DEBUG` - Debug information
- `levels.INFO` - Normal operation (default)
- `levels.WARN` - Warning messages
- `levels.ERROR` - Error messages
- `levels.FATAL` - Critical failures

### Methods

- `trace(message, context?)` - Log trace message
- `debug(message, context?)` - Log debug message
- `info(message, context?)` - Log info message
- `warn(message, context?)` - Log warning
- `error(message, context?)` - Log error
- `fatal(message, context?)` - Log fatal error

## Transport Options

### Console Transport (Default)

Logs to browser console.

### Storage Transport

```javascript
const logger = new Logger('app', {
  transport: 'storage',
});
```

### Custom Transport

```javascript
const logger = new Logger('app', {
  transport: (level, message, context) => {
    // Send to your backend
    fetch('/logs', {
      method: 'POST',
      body: JSON.stringify({ level, message, context }),
    });
  },
});
```

## Browser Support

- Chrome 90+
- Edge 90+
- Firefox 90+

## License

MIT
