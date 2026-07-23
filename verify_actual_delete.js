import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function runTest() {
  try {
    const docId = 'tk-test-delete-123';
    const colName = 'tasks';
    const docRef = doc(db, colName, docId);
    
    // Create the test task first
    await setDoc(docRef, { name: 'Test Task' });
    console.log("Created test task");
    
    // 1. Print the document ID.
    console.log("Deleted Firestore document ID:", docId);
    
    // 2. Print the full Firestore path.
    console.log("Collection path:", colName + "/" + docId);
    
    // 3. Await deleteDoc().
    const res = await deleteDoc(docRef);
    
    // 4. Print the actual SDK response.
    console.log("Firestore delete result:", res === undefined ? "undefined (Success)" : res);
    
    // 6. After deletion, immediately perform getDoc() on the same document.
    const snapshot = await getDoc(docRef);
    
    // 7. Print: Exists = true/false
    console.log("Exists =", snapshot.exists());
    
    if (!snapshot.exists()) {
      console.log("Final verification: PASS");
    } else {
      console.log("Final verification: FAIL");
    }
    
  } catch (err) {
    // 5. If deleteDoc throws, print the complete FirebaseError.
    console.error("Delete Error:", err);
    console.log("Final verification: FAIL");
  }
  process.exit(0);
}

runTest();
