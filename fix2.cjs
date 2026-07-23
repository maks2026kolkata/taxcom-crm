const fs = require('fs');
let code = fs.readFileSync('src/pages/MessageTemplates.tsx', 'utf8');

const lines = code.split('\n');
const newLines = lines.map(line => {
    if (line.includes('AlertTriangle className="w-6 h-6 text-rose-600" />  Eye,  Download,  ToggleLeft,  Type className="w-6 h-6 text-rose-600" />')) {
        return '                <AlertTriangle className="w-6 h-6 text-rose-600" />';
    }
    return line;
});

fs.writeFileSync('src/pages/MessageTemplates.tsx', newLines.join('\n'));
