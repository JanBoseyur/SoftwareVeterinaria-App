// scripts/gen-hash.js
const crypto = require('crypto');

const password = process.argv[2] || 'Secreta123';
const iterations = 100000;
const keylen = 32;
const digest = 'sha256';

const salt = crypto.randomBytes(16);
const key  = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);

console.log(`${iterations}:${digest}:${salt.toString('hex')}:${key.toString('hex')}`);
