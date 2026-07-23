const fs = require('fs');

const file = 'src/pages/Settings.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add imports
if (!code.includes("firebase/firestore")) {
  code = code.replace("import { isFirebaseEnabled } from '../db/firebase';", 
    "import { isFirebaseEnabled, db } from '../db/firebase';\nimport { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';\nimport { X } from 'lucide-react';");
}

fs.writeFileSync(file, code);
