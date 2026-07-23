const fs = require('fs');
let content = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');

// We will change the behavior where unknown users are put in pending_users.
// Instead, we will just add them to staff directly so they can login.
const toReplace = `              } else {
                // Not invited and not predefined - put into pending_users
                await setDoc(doc(db, 'pending_users', fbUser.uid), {
                  id: fbUser.uid,
                  name,
                  email: emailLower || '',
                  status: 'pending',
                  createdAt: new Date().toISOString()
                });
                setError('Your account is still pending Admin approval.');
                await signOut(auth);
                setFirebaseUser(null);
                setCurrentUser(null);
                setLoggedInUser(null);
                setIsLoading(false);
                return;
              }`;

const replacement = `              } else {
                role = 'Staff';
              }`;

content = content.replace(toReplace, replacement);

fs.writeFileSync('src/components/AuthContext.tsx', content);
