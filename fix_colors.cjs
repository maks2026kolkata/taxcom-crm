const fs = require('fs');
const file = 'src/pages/MessageTemplates.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/#F5405E/g, '#F43F5E');

fs.writeFileSync(file, code);
