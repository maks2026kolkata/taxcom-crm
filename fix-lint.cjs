const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /console\.log\("App render:".*isAuthenticated.*\);\n  const isAuthenticated = !!firebaseUser && !!currentUser;/,
  `const isAuthenticated = !!firebaseUser && !!currentUser;
  console.log("App render:", { isLoading, showLoader, isAuthenticated, hasFirebaseUser: !!firebaseUser, hasCurrentUser: !!currentUser });`
);
fs.writeFileSync('src/App.tsx', appContent);

let loginContent = fs.readFileSync('src/pages/Login.tsx', 'utf8');
loginContent = loginContent.replace(
  /React\.useEffect\(\(\) => \{\n    if \(isAuthenticated\) \{\n      navigate\('\/'\);\n    \}\n  \}, \[isAuthenticated, navigate\]\);\n\n  const navigate = useNavigate\(\);/,
  `const navigate = useNavigate();
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);`
);
fs.writeFileSync('src/pages/Login.tsx', loginContent);
