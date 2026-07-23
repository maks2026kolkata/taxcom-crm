const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs, query, where } = require('firebase/firestore');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim().replace(/^"/, '').replace(/"$/, '');
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const staffRef = collection(db, 'staff');
  const snap = await getDocs(staffRef);
  console.log("All Staff Documents:");
  snap.forEach(doc => {
    console.log(doc.id, " => ", doc.data());
  });
  
  // also get by email
  const q = query(staffRef, where("email", "==", "manager@taxcom.co.in"));
  const emailSnap = await getDocs(q);
  console.log("\nStaff with email manager@taxcom.co.in:");
  emailSnap.forEach(doc => {
    console.log(doc.id, " => ", doc.data());
  });
}
run().catch(console.error);
