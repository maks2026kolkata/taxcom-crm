const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /const \[showLoader, setShowLoader\] = useState\(true\);/,
  `const [showLoader, setShowLoader] = useState(true);
  console.log("App render:", { isLoading, showLoader, isAuthenticated, hasFirebaseUser: !!firebaseUser, hasCurrentUser: !!currentUser });`
);
appContent = appContent.replace(
  /setShowLoader\(true\);/,
  `{ console.log("setShowLoader(true)"); setShowLoader(true); }`
);
appContent = appContent.replace(
  /setShowLoader\(false\);/,
  `{ console.log("setShowLoader(false)"); setShowLoader(false); }`
);
fs.writeFileSync('src/App.tsx', appContent);

let loaderContent = fs.readFileSync('src/components/EnterpriseLoader.tsx', 'utf8');
loaderContent = loaderContent.replace(
  /const runInitialization = async \(\) => {/,
  `const runInitialization = async () => { console.log("runInitialization start");`
);
fs.writeFileSync('src/components/EnterpriseLoader.tsx', loaderContent);
