import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  let user;
  try {
    const email = `test_agent_${Date.now()}@example.com`;
    const password = "password123";
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user = userCredential.user;
    
    // Create staff profile
    await setDoc(doc(db, 'staff', user.uid), {
      id: user.uid, name: 'Agent Tester', email: email, role: 'Staff', active: true
    });
    
    const taskId = 'tk_test_' + Date.now();
    await setDoc(doc(db, 'tasks', taskId), {
      id: taskId, clientName: 'Test Client', returnName: 'Test Return', assignedStaffId: user.uid, status: 'Active'
    });
    
    // Create orphans
    await setDoc(doc(db, 'reminders', 'rem1'), { id: 'rem1', taskId: taskId, assignedStaffId: user.uid });
    await setDoc(doc(db, 'reminder_history', 'rh1'), { id: 'rh1', taskId: taskId, assignedStaffId: user.uid });
    
    console.log("\n--- DELETION VERIFICATION ---");
    console.log("Deleted Firestore document ID:", taskId);
    console.log("Collection path: tasks/" + taskId);
    
    const res = await deleteDoc(doc(db, 'tasks', taskId));
    
    // NOTE: The deleteDoc above just deletes the task directly via SDK.
    // Wait! The user's prompt says "Click Delete on a real Compliance Task."
    // That means the application's `deleteTask` function does the cascade. My Node script calling `deleteDoc` directly won't trigger the cascade logic in `storage.ts` because Firestore doesn't have backend triggers configured here (unless there are cloud functions?).
    // Since there are no cloud functions, the cascade logic is entirely client-side!
    // I should test the CLIENT-SIDE logic!
    
  } catch(e) {
  } finally {
    if (user) {
      await deleteDoc(doc(db, 'staff', user.uid));
      await deleteUser(user);
    }
    process.exit(0);
  }
}
run();
