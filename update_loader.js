const fs = require('fs');
let content = fs.readFileSync('src/components/EnterpriseLoader.tsx', 'utf8');

const imports = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle2, Server, Database, Key, LayoutDashboard, Lock, FileText, Calendar, CheckSquare, History, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../db/firebase';`;

content = content.replace(/import React.*lucide-react';/s, imports);

fs.writeFileSync('src/components/EnterpriseLoader.tsx', content);
