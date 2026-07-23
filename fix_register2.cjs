const fs = require('fs');
let content = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');

content = content.replace(
  "createUserWithEmailAndPassword,\\n  updateProfile,",
  "createUserWithEmailAndPassword,\n  updateProfile,"
);

content = content.replace(
  /createUserWithEmailAndPassword,\\n  updateProfile,/,
  "createUserWithEmailAndPassword,\n  updateProfile,"
);

fs.writeFileSync('src/components/AuthContext.tsx', content);
