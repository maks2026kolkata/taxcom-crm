const fs = require('fs');
const file = 'src/components/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace("import { \n  getDoc,\n  collection, \n  doc, \n  getDocs\n} from 'firebase/firestore';", "import { getDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';");
if (!code.includes('query')) {
  code = "import { query, where } from 'firebase/firestore';\n" + code;
}
fs.writeFileSync(file, code);
