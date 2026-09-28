const fs = require('fs');
const code = fs.readFileSync('bundle.js', 'utf8');

const base44Entities = [...code.matchAll(/entities\/([A-Za-z0-9_]+)/g)].map(m => m[1]);
console.log('Base44 entities:', [...new Set(base44Entities)]);

const endpoints = [...code.matchAll(/[\'\"](\/(api|entities)\/[^\'\"]+)[\'\"]/g)].map(m => m[1]);
console.log('Endpoints:', [...new Set(endpoints)].slice(0, 20));

// Find university fields
const uniIdx = code.indexOf('name_ar');
if (uniIdx !== -1) {
  console.log('Around name_ar:', code.substring(Math.max(0, uniIdx - 100), uniIdx + 300));
}

// Find search logic
const searchIdx = code.indexOf('الأكثر بحثًا');
if (searchIdx !== -1) {
  console.log('Around الأكثر بحثا:', code.substring(Math.max(0, searchIdx - 100), searchIdx + 400));
}
