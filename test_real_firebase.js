import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
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
    console.log("Creating user...", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user = userCredential.user;
    
    // Create staff profile
    console.log("Setting staff profile...");
    await setDoc(doc(db, 'staff', user.uid), {
      id: user.uid,
      name: 'Agent Tester',
      email: email,
      role: 'Staff',
      active: true
    });
    
    // Create a task
    const taskId = 'tk_test_' + Date.now();
    console.log("Creating test task...");
    await setDoc(doc(db, 'tasks', taskId), {
      id: taskId,
      clientName: 'Test Client',
      returnName: 'Test Return',
      assignedStaffId: user.uid, // crucial for permissions
      status: 'Active'
    });
    
    console.log("\n--- DELETION VERIFICATION ---");
    console.log("Deleted Firestore document ID:", taskId);
    console.log("Collection path: tasks/" + taskId);
    
    const res = await deleteDoc(doc(db, 'tasks', taskId));
    console.log("Firestore delete result:", res === undefined ? "SUCCESS" : res);
    
    const snap = await getDoc(doc(db, 'tasks', taskId));
    console.log("Exists =", snap.exists());
    
    if (!snap.exists()) {
      console.log("Final verification: PASS");
    } else {
      console.log("Final verification: FAIL");
    }
    
  } catch(e) {
    console.error("Error:", e);
    console.log("Final verification: FAIL");
  } finally {
    if (user) {
      try {
        await deleteDoc(doc(db, 'staff', user.uid));
        await deleteUser(user);
      } catch (e) {}
    }
    process.exit(0);
  }
}

run();
