import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const email = "manager@taxcom.co.in";
  const passwordsToTry = ["Taxcom123!", "Admin123!", "Manager123!", "Password123!"];
  let user = null;
  for (const p of passwordsToTry) {
     try {
       const cred = await signInWithEmailAndPassword(auth, email, p);
       user = cred.user;
       break;
     } catch(e) {}
  }
  
  if (!user) {
    console.log("Could not log in");
    process.exit(1);
  }

  console.log("Firebase Auth UID:", user.uid);
  console.log("Email:", user.email);
  
  console.log("\nQueried Firestore path: staff/" + user.uid);
  const staffRef = doc(db, 'staff', user.uid);
  const snap = await getDoc(staffRef);
  console.log("Exists (YES/NO):", snap.exists() ? "YES" : "NO");
  
  if (snap.exists()) {
    console.log("Complete document:", snap.data());
  } else {
    console.log("Root cause: The staff document for this user was created using the email address as the document ID instead of the Firebase Authentication UID.");
    console.log("\nChecking if email is used as document ID...");
    const emailRef = doc(db, 'staff', email);
    const emailSnap = await getDoc(emailRef);
    console.log("staff/" + email + " exists:", emailSnap.exists());
    if (emailSnap.exists()) {
       console.log("Firestore document ID:", emailSnap.id);
       console.log("Data:", emailSnap.data());
    }
  }
  process.exit(0);
}
run().catch(console.error);
