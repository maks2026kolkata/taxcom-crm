const fs = require('fs');

let loaderContent = fs.readFileSync('src/components/EnterpriseLoader.tsx', 'utf8');
const match = loaderContent.match(/const runInitialization = async \(\) => \{([\s\S]*?)try \{/);
console.log(match ? match[1] : 'not found');
