const fs = require('fs');
const file = 'src/pages/MessageTemplates.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace("import { getTemplates, updateTemplate, createTemplate, deleteTemplate } from '../db/storage';", "import { getTemplates, updateTemplate, createTemplate, deleteTemplate, getSignatureSettings } from '../db/storage';");
fs.writeFileSync(file, code);
