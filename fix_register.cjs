const fs = require('fs');
let content = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');

// Add updateProfile to imports
if (!content.includes('updateProfile')) {
  content = content.replace(
    /createUserWithEmailAndPassword,/,
    "createUserWithEmailAndPassword,\\n  updateProfile,"
  );
}

// Update the register function
const newRegister = `  const register = async (email: string, password: string, name: string) => {
    setError(null);
    if (auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (cred.user) {
          await updateProfile(cred.user, { displayName: name });
          
          // Also proactively add them to the staff collection so they have the correct name and role immediately
          const emailLower = email.toLowerCase();
          await setDoc(doc(db, 'staff', cred.user.uid), {
            id: cred.user.uid,
            name: name,
            email: emailLower,
            role: 'Staff',
            active: true,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err: any) {
        console.error('Registration failed:', err);
        setError(err.message || 'Registration failed');
        throw err;
      }
    } else {
      setError('Registration is not supported in Local Demo Mode. Please use admin@taxcom.co.in or manager@taxcom.co.in to test.');
      throw new Error('Registration is not supported in Local Demo Mode.');
    }
  };`;

content = content.replace(
  /const register = async \(email: string, password: string, name: string\) => \{[\s\S]*?\} else \{\s*setError\('Registration is not supported[\s\S]*?throw new Error\('Registration is not supported[\s\S]*?\}\s*\};/,
  newRegister
);

fs.writeFileSync('src/components/AuthContext.tsx', content);
