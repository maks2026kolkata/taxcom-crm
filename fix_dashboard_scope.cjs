const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// The confirmRejectUser function got placed inside useEffect. Let's extract it.
const regex = /const confirmRejectUser = \(\) => \{[\s\S]*?\}\n  \};\n\n  return \(\) => \{/;

code = code.replace(regex, `return () => {`);

const newConfirmReject = `
  const confirmRejectUser = () => {
    if (userToReject) {
      try {
        const staffList = load<Staff[]>(KEYS.STAFF, []);
        const updated = staffList.filter(s => s.id !== userToReject.id);
        save(KEYS.STAFF, updated);
        
        if (isFirebaseEnabled && db) {
          deleteFromCloud('staff', userToReject.id);
        } else {
          setPendingUsers(updated);
          window.dispatchEvent(new Event('database-sync'));
        }
        showToast(\`Rejected and removed registration for \${userToReject.name}\`, 'info');
      } catch (err) {
        console.error('Error rejecting user:', err);
        showToast('Failed to reject registration. Try again.', 'error');
      } finally {
        setUserToReject(null);
      }
    }
  };
`;

code = code.replace('  const handleApproveUser = async (userId: string) => {', newConfirmReject + '\n  const handleApproveUser = async (userId: string) => {');

fs.writeFileSync('src/pages/Dashboard.tsx', code);
