const fs = require('fs');

let content = fs.readFileSync('src/components/EnterpriseLoader.tsx', 'utf8');

// Replace the main wrapper div
content = content.replace(
  /<div className="fixed inset-0 z-\[100\] flex items-center justify-center bg-gradient-to-br from-\[#F8FAFC\] to-\[#EEF2F7\] font-sans overflow-y-auto py-8">/,
  `<div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F7] font-sans h-[100dvh] min-h-[100dvh] w-screen overflow-hidden overscroll-none">`
);

// We need to inject a useLayoutEffect to disable body scrolling
const useEffectSnippet = `
  useEffect(() => {
    // Prevent body scrolling while loader is mounted
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
`;
content = content.replace(
  '// Rotating Messages',
  useEffectSnippet + '\n  // Rotating Messages'
);

// Replace background shields
content = content.replace(
  /<div className="absolute inset-0 overflow-hidden pointer-events-none">[\s\S]*?<\/div>(\s*<AnimatePresence mode="wait">)/,
  `<div className="absolute inset-0 overflow-hidden pointer-events-none w-full h-full">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[-5%] transform rotate-12 flex justify-center items-center max-w-[45vw] md:max-w-[35vw] lg:max-w-[25vw]"
        >
          <Shield className="w-full h-auto text-slate-900" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] right-[-5%] transform -rotate-12 flex justify-center items-center max-w-[45vw] md:max-w-[35vw] lg:max-w-[25vw]"
        >
          <Shield className="w-full h-auto text-slate-900" />
        </motion.div>
      </div>$1`
);

// Replace card container styles
content = content.replace(
  /className="relative z-10 w-full max-w-4xl bg-white\/70 backdrop-blur-xl border border-white\/40 shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col mx-4 my-auto"/,
  `className="relative z-10 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-[20px] md:p-[32px] lg:p-[48px] flex flex-col items-center justify-center w-[calc(100%-32px)] md:w-[90%] lg:w-[620px] lg:max-w-[620px] max-h-[80vh] overflow-hidden"`
);

// Make the Header text smaller and space smaller on mobile
content = content.replace(
  /<div className="flex flex-col items-center text-center space-y-4 mb-10">/,
  `<div className="flex flex-col items-center text-center space-y-3 mb-6 lg:mb-8 shrink-0">`
);

// Scale steps list and add scroll
content = content.replace(
  /<div className="flex-1 w-full space-y-3">/,
  `<div className="flex-1 w-full space-y-3 max-h-[200px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">`
);

// Center the steps + progress
content = content.replace(
  /<div className="flex flex-col md:flex-row gap-12 items-center justify-center">/,
  `<div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center w-full overflow-hidden shrink min-h-0">`
);

// Shrink progress circle
content = content.replace(
  /<div className="flex flex-col items-center justify-center w-64 shrink-0">/,
  `<div className="flex flex-col items-center justify-center w-40 md:w-64 shrink-0">`
);
content = content.replace(
  /<div className="relative w-48 h-48">/,
  `<div className="relative w-32 h-32 md:w-48 md:h-48">`
);
content = content.replace(
  /<span className="text-4xl font-black text-slate-800">/,
  `<span className="text-2xl md:text-4xl font-black text-slate-800">`
);
content = content.replace(
  /<div className="h-8 mt-6">/,
  `<div className="h-8 mt-4 md:mt-6">`
);
content = content.replace(
  /<h1 className="text-3xl font-black tracking-tight text-slate-900">/,
  `<h1 className="text-xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">`
);
content = content.replace(
  /<h2 className="text-2xl font-bold text-slate-800">/,
  `<h2 className="text-lg md:text-2xl font-bold text-slate-800">`
);

// Fix bottom status panel - hide on very small screens or make it shrink
content = content.replace(
  /<div className="mt-12 pt-6 border-t border-slate-200\/60 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center md:text-left">/,
  `<div className="hidden lg:grid mt-8 pt-4 border-t border-slate-200/60 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center md:text-left shrink-0">`
);

// Make the security notice smaller and shrinkable
content = content.replace(
  /<div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-slate-100\/50 py-2.5 px-4 rounded-lg">/,
  `<div className="mt-6 flex items-center justify-center gap-2 text-[10px] md:text-xs font-medium text-slate-500 bg-slate-100/50 py-2 px-3 rounded-lg shrink-0 w-full text-center">`
);
content = content.replace(
  /<span>Your data is protected using enterprise-grade encryption.<\/span>/,
  `<span className="truncate">Your data is protected using enterprise-grade encryption.</span>`
);

// Make sure steps shrink
content = content.replace(
  /<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-\[#F5405E\] to-rose-600 flex items-center justify-center text-white font-black text-4xl shadow-lg shadow-rose-500\/30">/,
  `<div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#F5405E] to-rose-600 flex items-center justify-center text-white font-black text-2xl md:text-4xl shadow-lg shadow-rose-500/30">`
);

fs.writeFileSync('src/components/EnterpriseLoader.tsx', content);

// Add custom scrollbar styling to index.css if not exists
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.custom-scrollbar')) {
  css += `
@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
}
`;
  fs.writeFileSync('src/index.css', css);
}
