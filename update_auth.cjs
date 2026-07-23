const fs = require('fs');
let content = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');

if (!content.includes('import { onSnapshot } from')) {
    content = content.replace(/import { \n  collection,/s, "import { \n  collection,\n  onSnapshot,");
}

const useEffectSnippet = `
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

content = content.replace(/const unsubscribe = onAuthStateChanged/s, useEffectSnippet + '\n  const unsubscribe = onAuthStateChanged');

fs.writeFileSync('src/components/AuthContext.tsx', content);
