const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// The block we want to replace
const blockToReplace = `{currentUser?.email && (
              <p className="text-[10px] font-medium text-slate-500 truncate" title={currentUser.email}>
                {currentUser.email}
              </p>
            )}`;

const newBlock = `{currentUser?.email && (!currentUser?.name || currentUser.name !== currentUser.email) && (
              <p className="text-[10px] font-medium text-slate-500 truncate" title={currentUser.email}>
                {currentUser.email}
              </p>
            )}`;

content = content.replace(blockToReplace, newBlock);
content = content.replace(blockToReplace, newBlock); // Replace both desktop and mobile instances

fs.writeFileSync('src/components/Layout.tsx', content);
