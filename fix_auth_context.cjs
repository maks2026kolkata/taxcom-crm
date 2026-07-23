const fs = require('fs');
const file = 'src/components/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace("import { doc, getDoc, collection, getDocs } from 'firebase/firestore';", "import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';");
fs.writeFileSync(file, code);
