const fs = require('fs');

let storageCode = fs.readFileSync('src/db/storage.ts', 'utf8');
storageCode = storageCode.replace('async function deleteFromCloud', 'export async function deleteFromCloud');
fs.writeFileSync('src/db/storage.ts', storageCode);

let dashCode = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
dashCode = dashCode.replace(
  '  getAuditLogs\n} from \'../db/storage\';',
  '  getAuditLogs,\n  deleteFromCloud\n} from \'../db/storage\';'
);
fs.writeFileSync('src/pages/Dashboard.tsx', dashCode);
