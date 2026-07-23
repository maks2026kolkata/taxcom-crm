const fs = require('fs');
let code = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

code = code.replace(/import \{ X \} from 'lucide-react';/, "import { X, Check } from 'lucide-react';");

fs.writeFileSync('src/pages/Settings.tsx', code);
