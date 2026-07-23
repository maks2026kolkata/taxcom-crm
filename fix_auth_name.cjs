const fs = require('fs');
let content = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');

// In AuthContext.tsx, replace the predefined user name logic
content = content.replace(
  /let name = fbUser\.displayName \|\| emailLower\?\.split\('@'\)\[0\] \|\| 'Staff Member';/,
  "let name = fbUser.displayName || '';"
);

content = content.replace(
  /let name = email\.split\('@'\)\[0\] \|\| 'Demo Staff';/,
  "let name = '';"
);

// Update the real-time listener logic
content = content.replace(
  /const newName = data\.name \|\| data\.fullName \|\| firebaseUser\.displayName \|\| currentUser\.email \|\| 'User';/,
  "const newName = data.name || data.fullName || firebaseUser.displayName || '';"
);

fs.writeFileSync('src/components/AuthContext.tsx', content);
