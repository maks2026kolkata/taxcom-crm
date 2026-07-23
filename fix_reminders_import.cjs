const fs = require('fs');
const file = 'src/pages/Reminders.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { EmailModal } from '../components/EmailModal';");
fs.writeFileSync(file, code);
