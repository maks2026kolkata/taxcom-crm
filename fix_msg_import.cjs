const fs = require('fs');
const file = 'src/pages/MessageTemplates.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace("import { getTemplates, saveTemplates, MessageTemplate } from '../db/storage';", "import { getTemplates, saveTemplates, MessageTemplate, getSignatureSettings } from '../db/storage';");
fs.writeFileSync(file, code);
