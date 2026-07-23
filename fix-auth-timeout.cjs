const fs = require('fs');

let authContent = fs.readFileSync('src/components/AuthContext.tsx', 'utf8');
authContent = authContent.replace(
  /const unsubscribe = onAuthStateChanged\(auth, async \(fbUser\) => \{/,
  `const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      // Safety timeout to prevent infinite loading if Firestore hangs
      const fallbackTimeout = setTimeout(() => {
        console.warn('Auth state processing timed out! Forcing isLoading to false.');
        setIsLoading(false);
      }, 8000);`
);

authContent = authContent.replace(
  /setIsLoading\(false\);\n    \}\);\n\n    return \(\) => unsubscribe\(\);/,
  `setIsLoading(false);\n      clearTimeout(fallbackTimeout);\n    });\n\n    return () => unsubscribe();`
);

fs.writeFileSync('src/components/AuthContext.tsx', authContent);
