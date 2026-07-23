const fs = require('fs');
let code = fs.readFileSync('src/pages/MessageTemplates.tsx', 'utf8');

code = code.replace(
  '<button\n                                onClick={() => { setActiveDropdown(null); setTemplateToDelete(tmpl); }}\n                                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center"\n                              >\n                                <Trash2 className="w-3.5 h-3.5 mr-2 text-rose-500" />\n                                Delete\n                              </button>',
  '{isAdmin && (\n<button\n                                onClick={() => { setActiveDropdown(null); setTemplateToDelete(tmpl); }}\n                                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center"\n                              >\n                                <Trash2 className="w-3.5 h-3.5 mr-2 text-rose-500" />\n                                Delete\n                              </button>\n)}'
);

fs.writeFileSync('src/pages/MessageTemplates.tsx', code);
