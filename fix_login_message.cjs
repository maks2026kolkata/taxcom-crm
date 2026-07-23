const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');

content = content.replace(
  /Registration successful! Your account is pending Admin approval\. You cannot log in until approved\./g,
  "Registration successful! You can now log in."
);

fs.writeFileSync('src/pages/Login.tsx', content);
