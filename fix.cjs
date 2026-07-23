const fs = require('fs');
let code = fs.readFileSync('src/pages/MessageTemplates.tsx', 'utf8');

// Fix imports
code = code.replace(
    '  AlertTriangle className="w-6 h-6 text-rose-600" />\n  Eye,\n  Download,\n  Power,\n  Settings2,\n  Eye,\n  Download,\n  ToggleLeft,\n  Type\n} from \'lucide-react\';',
    '  AlertTriangle,\n  Eye,\n  Download,\n  Power,\n  Settings2,\n  ToggleLeft,\n  Type\n} from \'lucide-react\';'
);

// Fix JSX
code = code.replace(
    '<AlertTriangle className="w-6 h-6 text-rose-600" />  Eye,  Download,  ToggleLeft,  Type className="w-6 h-6 text-rose-600" />',
    '<AlertTriangle className="w-6 h-6 text-rose-600" />'
);

fs.writeFileSync('src/pages/MessageTemplates.tsx', code);
