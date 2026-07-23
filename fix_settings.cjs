const fs = require('fs');
let code = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

code = code.replace(/<HardDrive,\n  Trash2,\n  RefreshCw /g, '<HardDrive ');

fs.writeFileSync('src/pages/Settings.tsx', code);
