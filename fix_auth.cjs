const fs = require('fs');
let content = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');

const innerUseEffect = `
  useEffect(() => {
    if (!auth || !firebaseUser || !currentUser) return;
    
    // Set up real-time listener for the authenticated user's staff profile
    const staffDocRef = doc(db, 'staff', firebaseUser.uid);
    const unsubscribe = onSnapshot(staffDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.active === false) {
          // Deactivated user
          logout();
          return;
        }
        
        const newName = data.name || data.fullName || firebaseUser.displayName || currentUser.email || 'User';
        
        if (newName !== currentUser.name || data.role !== currentUser.role) {
          const updatedUser = {
            ...currentUser,
            name: newName,
            role: (data.role as UserRole) || currentUser.role,
          };
          setCurrentUser(updatedUser);
          setLoggedInUser(updatedUser);
          localStorage.setItem('cached_user_profile', JSON.stringify(updatedUser));
        }
      }
    }, (error) => {
      console.warn('User profile real-time listener error:', error);
    });
    
    return () => unsubscribe();
  }, [firebaseUser?.uid]); // Deliberately only re-run if UID changes
`;

// Remove the injected inner useEffect
const lines = content.split('\\n');
let newLines = [];
let skip = false;
let foundInner = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Set up real-time listener') && !foundInner) {
    foundInner = true;
    // Walk back and remove the 'useEffect(() => {' line
    newLines.pop();
    newLines.pop(); // if (!auth || !firebaseUser || !currentUser) return;
    newLines.pop(); // useEffect
    skip = true;
    continue;
  }
  if (skip && lines[i].includes('// Deliberately only re-run if UID changes')) {
    skip = false;
    continue;
  }
  if (!skip) {
    newLines.push(lines[i]);
  }
}

content = newLines.join('\\n');

// Now insert it correctly AT THE ROOT of AuthProvider
// Look for `const [error, setError] = useState<string | null>(null);`
content = content.replace(
  'const [error, setError] = useState<string | null>(null);',
  'const [error, setError] = useState<string | null>(null);\\n' + innerUseEffect
);

fs.writeFileSync('src/components/AuthContext.tsx', content);
