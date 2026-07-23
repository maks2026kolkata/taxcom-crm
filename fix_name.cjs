const fs = require('fs');
let content = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');

content = content.replace(
  /let name = fbUser\.displayName \|\| '';/,
  "let name = fbUser.displayName || (emailLower === 'admin@taxcom.co.in' ? 'Admin User' : emailLower === 'manager@taxcom.co.in' ? 'Manager User' : (emailLower?.split('@')[0] || 'Staff Member'));"
);

content = content.replace(
  /const newName = data\.name \|\| data\.fullName \|\| firebaseUser\.displayName \|\| '';/,
  "const newName = data.name || data.fullName || firebaseUser.displayName || (currentUser.email === 'admin@taxcom.co.in' ? 'Admin User' : currentUser.email === 'manager@taxcom.co.in' ? 'Manager User' : (currentUser.email?.split('@')[0] || 'Staff Member'));"
);

fs.writeFileSync('src/components/AuthContext.tsx', content);

// Let's also fix Layout.tsx just to use currentUser.name directly, with fallback to "User"
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace(
  /\{currentUser\?\.name \? currentUser\.name\.replace\(\/\\b\\w\/g, l => l\.toUpperCase\(\)\) : \(currentUser\?\.email \|\| 'User'\)\}/g,
  "{currentUser?.name ? currentUser.name.replace(/\\b\\w/g, l => l.toUpperCase()) : 'User'}"
);
fs.writeFileSync('src/components/Layout.tsx', layout);

