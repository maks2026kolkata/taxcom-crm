const fs = require('fs');

const file = 'src/components/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('query')) {
  code = code.replace(
    /import { getFirestore, doc, setDoc, deleteDoc, getDoc, onSnapshot } from 'firebase\/firestore';/,
    "import { getFirestore, doc, setDoc, deleteDoc, getDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';"
  );
  fs.writeFileSync(file, code);
}
