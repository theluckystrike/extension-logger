# extension-logger — Structured Logging for Chrome Extensions

[![npm](https://img.shields.io/npm/v/extension-logger.svg)](https://www.npmjs.com/package/extension-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)]()

> **Built by [Zovo](https://zovo.one)**

**Structured logging** — log levels, colored console, context scoping, storage persistence, export (JSON/CSV/text), and performance timing. Zero dependencies.

## 📦 Install
```bash
npm install extension-logger
```

## 🚀 Quick Start
```typescript
import { Logger, PerfTimer, LogStorage, LogExporter } from 'extension-logger';

const log = new Logger('background', { minLevel: 'info', persist: true });
log.info('Extension started');
log.error('API call failed', { status: 500 });

const child = log.child('storage');
child.debug('Writing settings');

const perf = new PerfTimer(log);
await perf.measure('fetchData', () => fetch('/api/data'));

const entries = await LogStorage.getRecent(30);
const text = LogExporter.toText(entries);
```

## 📄 License
MIT — [Zovo](https://zovo.one)
