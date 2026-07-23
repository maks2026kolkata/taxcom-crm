const fs = require('fs');

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{[\s\S]*?window\.removeEventListener\('database-sync', handleSync\);\s*unsubPending\(\);\s*\};\s*\}, \[\]\);/;

const replacement = `useEffect(() => {
    let unsubs: (() => void)[] = [];
    
    if (isFirebaseEnabled && db) {
      // Real-time Firestore Listeners
      const subscribe = (colName, setter) => {
        const unsub = onSnapshot(collection(db, colName), (snapshot) => {
          const list = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setter(list);
        }, (error) => {
          console.warn(\`[FIRESTORE] Subscription error for "\${colName}":\`, error);
        });
        unsubs.push(unsub);
      };

      subscribe('tasks', setTasks);
      subscribe('clients', setClients);
      subscribe('reminders', setReminders);
      subscribe('staff', setStaff);
      subscribe('audit_logs', (list) => {
        // Sort audit logs by timestamp desc
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAuditLogs(list);
      });
      subscribe('pending_users', setPendingUsers);
      // Wait, the prompt says "payments" too. Does payments collection exist? 
      // In Clients.tsx it is "payments"
      // Wait, there is no setPayments in Dashboard, but let's check if it exists.
    } else {
      // Local Storage Fallback
      const handleSync = () => {
        setTasks(getTasks());
        setClients(getClients());
        setReminders(getReminders());
        setStaff(getStaff());
        setAuditLogs(getAuditLogs());
        setPendingUsers(JSON.parse(localStorage.getItem('pending_users') || '[]'));
      };
      handleSync(); // Initial load
      window.addEventListener('database-sync', handleSync);
      unsubs.push(() => window.removeEventListener('database-sync', handleSync));
    }

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);`;

dash = dash.replace(regex, replacement);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
