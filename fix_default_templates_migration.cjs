const fs = require('fs');
const file = 'src/db/storage.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /const normalized = list\.map\(t => \{([\s\S]*?)return t;\n  \}\);/;

const replace = `
  const normalized = list.map(t => {
    let tChanged = false;
    
    if (!t.templateName) {
      t.templateName = t.type || t.title || 'Untitled';
      tChanged = true;
    }
    if (!t.category) {
      t.category = 'General';
      tChanged = true;
    }
    if (!t.communicationType) {
      t.communicationType = 'Both';
      tChanged = true;
    }
    if (!t.emailSubject) {
      t.emailSubject = t.subject || '';
      tChanged = true;
    }
    if (!t.messageBody) {
      t.messageBody = t.body || '';
      tChanged = true;
    }
    
    // Auto-update System Default templates with new signature
    if (t.isDefault) {
       const oldSig = /Regards,\\n\\{\\{staffName\\}\\}\\n\\{\\{companyName\\}\\}/g;
       const newSig = 'Regards,\\n\\nTeam {{companyName}}';
       if (t.body && oldSig.test(t.body)) {
         t.body = t.body.replace(oldSig, newSig);
         tChanged = true;
       }
       if (t.messageBody && oldSig.test(t.messageBody)) {
         t.messageBody = t.messageBody.replace(oldSig, newSig);
         tChanged = true;
       }
    }

    if (tChanged) {
      changed = true;
    }
    return t;
  });
`;

code = code.replace(regex, replace.trim());
fs.writeFileSync(file, code);
