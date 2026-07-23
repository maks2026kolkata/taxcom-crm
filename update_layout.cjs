const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Replace desktop sidebar profile section
const profileDesktop = `
        {/* User context role and Secure Sign Out */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
          <div className="flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800 truncate leading-none" title={currentUser?.name || currentUser?.email || 'User'}>
                {currentUser?.name || currentUser?.email || 'User'}
              </p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-[#F5405E] border border-rose-100/50 shrink-0">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
            {currentUser?.email && (
              <p className="text-[10px] font-medium text-slate-500 truncate" title={currentUser.email}>
                {currentUser.email}
              </p>
            )}
          </div>
          
          <button
`;
content = content.replace(/\{\/\* User context role and Secure Sign Out \*\/}.*?\<button/s, profileDesktop.trim());

// Replace mobile sidebar profile section
const profileMobile = `
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-4 space-y-3">
              <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 truncate leading-none" title={currentUser?.name || currentUser?.email || 'User'}>
                    {currentUser?.name || currentUser?.email || 'User'}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-[#F5405E] border border-rose-100/50 shrink-0">
                    {currentUser?.role || 'ADMIN'}
                  </span>
                </div>
                {currentUser?.email && (
                  <p className="text-[10px] font-medium text-slate-500 truncate" title={currentUser.email}>
                    {currentUser.email}
                  </p>
                )}
              </div>
              <button
`;
content = content.replace(/\<div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-4 space-y-3">.*?\<button/s, profileMobile.trim());

fs.writeFileSync('src/components/Layout.tsx', content);
