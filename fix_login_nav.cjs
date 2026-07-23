const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');

// We want to add an effect that watches isAuthenticated and navigates
const useEffectSnippet = `
  const { login, register, resetPassword, error, isLoading, isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
`;
content = content.replace(
  /const \{ login, register, resetPassword, error, isLoading \} = useAuth\(\);/,
  useEffectSnippet
);

fs.writeFileSync('src/pages/Login.tsx', content);
