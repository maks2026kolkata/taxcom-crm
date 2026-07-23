const fs = require('fs');
const file = 'src/pages/MessageTemplates.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<button\s+onClick=\{closeEditor\}\s+className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"\s+>\s+Cancel\s+<\/button>[\s\S]*?<button\s+onClick=\{handleSave\}\s+className="inline-flex items-center px-5 py-2 text-sm font-bold text-white bg-\[#F43F5E\] hover:bg-rose-600 rounded-xl shadow-sm transition-all"\s+>[\s\S]*?<Save className="w-4 h-4 mr-2" \/>\s+Save Template\s+<\/button>\s+<\/div>\s+<\/div>/;

const replacement = `
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-2 z-40">
            <div className="flex items-center gap-3">
              <button
                onClick={closeEditor}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {editingTemplate ? (editingTemplate.isDefault ? 'Edit System Template' : 'Edit Custom Template') : 'Create New Template'}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {editingTemplate?.isDefault ? 'Some fields are restricted for system defaults.' : 'Fully customize your communication template.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={closeEditor}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-[#F43F5E] hover:bg-rose-600 rounded-xl shadow-sm transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </button>
            </div>
          </div>`;

code = code.replace(regex, replacement.trim());
fs.writeFileSync(file, code);
