// This file loads the TypeScript configuration
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { default: config } = require('./next.config.js.mjs');

module.exports = config;