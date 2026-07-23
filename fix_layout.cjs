const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const formatNameFn = `
function formatName(name) {
  if (!name) return 'User';
  if (name.toLowerCase() === 'admin') return 'Administrator';
  if (name.toLowerCase() === 'manager') return 'Manager';
  return name.replace(/\\b\\w/g, l => l.toUpperCase());
}
`;

// wait, we can just do this inline in Layout.tsx
content = content.replace(
  /\{currentUser\?\.name \|\| currentUser\?\.email \|\| 'User'\}/g,
  "{currentUser?.name ? currentUser.name.replace(/\\b\\w/g, l => l.toUpperCase()) : (currentUser?.email || 'User')}"
);

fs.writeFileSync('src/components/Layout.tsx', content);
