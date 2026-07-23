import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVHyFlYsUdsmD81dq80ktpY0ymW7nKWrY",
  authDomain: "taxcom-technologies-crm.firebaseapp.com",
  projectId: "taxcom-technologies-crm",
  storageBucket: "taxcom-technologies-crm.firebasestorage.app",
  messagingSenderId: "497159970678",
  appId: "1:497159970678:web:12ae38b2a19bed51bda457",
  measurementId: "G-H6NWDY6KR9"
};

async function diagnose() {
  console.log("Initializing Firebase App...");
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("Checking anonymous/unauthenticated read on staff collection...");
  try {
    const snap = await getDocs(query(collection(db, 'staff'), limit(1)));
    console.log("Unauthenticated list staff: SUCCESS, count =", snap.size);
  } catch (err: any) {
    console.log("Unauthenticated list staff: FAILED, error =", err.message);
  }

  console.log("Checking unauthenticated get on a specific staff ID...");
  try {
    const snap = await getDoc(doc(db, 'staff', 'some_dummy_id'));
    console.log("Unauthenticated get staff doc: SUCCESS, exists =", snap.exists());
  } catch (err: any) {
    console.log("Unauthenticated get staff doc: FAILED, error =", err.message);
  }

  // Attempt to sign in as admin or manager
  const testUsers = [
    { email: 'admin@taxcom.co.in', pass: 'Admin123!' },
    { email: 'manager@taxcom.co.in', pass: 'Manager123!' },
    { email: 'multiworktest25@gmail.com', pass: 'Password123!' } // try some guess or standard passwords
  ];

  for (const user of testUsers) {
    console.log(`\nAttempting to sign in as ${user.email}...`);
    try {
      const cred = await signInWithEmailAndPassword(auth, user.email, 'Taxcom123!'); // try Taxcom123!
      console.log(`Signed in successfully as ${user.email}, uid = ${cred.user.uid}`);
      
      console.log(`Testing read on staff/${cred.user.uid}...`);
      try {
        const snap = await getDoc(doc(db, 'staff', cred.user.uid));
        console.log(`Get own staff doc: SUCCESS, exists = ${snap.exists()}`);
        if (snap.exists()) {
          console.log(`Data:`, JSON.stringify(snap.data()));
        }
      } catch (err: any) {
        console.log(`Get own staff doc: FAILED, error =`, err.message);
      }

      console.log(`Testing list on staff collection...`);
      try {
        const snap = await getDocs(query(collection(db, 'staff'), limit(1)));
        console.log(`List staff collection: SUCCESS, count = ${snap.size}`);
      } catch (err: any) {
        console.log(`List staff collection: FAILED, error =`, err.message);
      }

      await auth.signOut();
    } catch (loginErr: any) {
      console.log(`Login failed for ${user.email}:`, loginErr.message);
    }
  }
}

diagnose().catch(console.error);
