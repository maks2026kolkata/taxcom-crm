const fs = require('fs');

let loaderContent = fs.readFileSync('src/components/EnterpriseLoader.tsx', 'utf8');
loaderContent = loaderContent.replace(
  /const fetchCheck = async \(colName: string\) => \{[\s\S]*?try \{[\s\S]*?await getDocs\(query\(collection\(db, colName\), limit\(1\)\)\);[\s\S]*?\} catch \(e\) \{[\s\S]*?\/\/ Ignore read errors, we just want to verify connection\/init[\s\S]*?\}[\s\S]*?\};/,
  `const fetchCheck = async (colName: string) => {
          try {
             const fetchPromise = getDocs(query(collection(db, colName), limit(1)));
             const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
             await Promise.race([fetchPromise, timeoutPromise]);
          } catch (e) {
             // Ignore read errors or timeouts, we just want to verify connection/init
          }
        };`
);
fs.writeFileSync('src/components/EnterpriseLoader.tsx', loaderContent);
