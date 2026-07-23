import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const email = "manager@taxcom.co.in";
  // The password wasn't provided, but wait, maybe I can just query Firestore to find the UID without logging in.
  
  console.log("Looking up staff by email:", email);
  const q = query(collection(db, 'staff'), where('email', '==', email));
  const snap = await getDocs(q);
  
  if (snap.empty) {
    console.log("No staff found with this email in Firestore!");
  } else {
    snap.forEach(d => {
      console.log("Found staff doc ID (this should be the UID):", d.id);
      console.log("Document data:", JSON.stringify(d.data(), null, 2));
    });
  }
  
  console.log("\nGetting all staff documents to see if there's any mismatch");
  const allStaff = await getDocs(collection(db, 'staff'));
  allStaff.forEach(d => {
    console.log("Staff Doc:", d.id, "=>", JSON.stringify(d.data(), null, 2));
  });

  process.exit(0);
}
run().catch(console.error);
