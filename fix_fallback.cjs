const fs = require('fs');

const file = 'src/components/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `            const emailQ = query(collection(db, 'staff'), where('email', '==', firebaseUser.email));
            const emailSnap = await getDocs(emailQ);
            if (!emailSnap.empty) {
              console.log('REPORT: Found staff document using email query instead of UID!');
              emailSnap.forEach(d => {
                console.log('Found doc ID:', d.id);
                console.log('Found doc data:', JSON.stringify(d.data(), null, 2));
              });
            } else {
              // What if the doc ID is exactly the email?
              const emailDocRef = doc(db, 'staff', firebaseUser.email);
              const emailDocSnap = await getDoc(emailDocRef);
              if (emailDocSnap.exists()) {
                console.log('REPORT: Found staff document where ID is the email!');
              }
            }`,
  `            try {
              const emailQ = query(collection(db, 'staff'), where('email', '==', firebaseUser.email));
              const emailSnap = await getDocs(emailQ);
              if (!emailSnap.empty) {
                console.log('REPORT: Found staff document using email query instead of UID!');
                emailSnap.forEach(d => {
                  console.log('Found doc ID:', d.id);
                  console.log('Found doc data:', JSON.stringify(d.data(), null, 2));
                });
              } else {
                const emailDocRef = doc(db, 'staff', firebaseUser.email);
                const emailDocSnap = await getDoc(emailDocRef);
                if (emailDocSnap.exists()) {
                  console.log('REPORT: Found staff document where ID is the email!');
                }
              }
            } catch(fallbackErr: any) {
              console.warn("Fallback query failed (likely permission denied, which confirms rule enforcement):", fallbackErr.message);
            }`
);

fs.writeFileSync(file, code);
