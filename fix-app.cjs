const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /console\.log\("App render:", \{ isLoading, showLoader, isAuthenticated, hasFirebaseUser: !!firebaseUser, hasCurrentUser: !!currentUser \}\);\n\n  const isAuthenticated = !!firebaseUser && !!currentUser;/,
  `const isAuthenticated = !!firebaseUser && !!currentUser;\n  console.log("App render:", { isLoading, showLoader, isAuthenticated, hasFirebaseUser: !!firebaseUser, hasCurrentUser: !!currentUser });`
);
fs.writeFileSync('src/App.tsx', appContent);
