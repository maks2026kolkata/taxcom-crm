const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  'const confirmRejectUser = () => {',
  'const confirmRejectUser = async () => {'
);
code = code.replace(
  "deleteFromCloud('staff', userToReject.id);",
  "await deleteFromCloud('staff', userToReject.id);"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
