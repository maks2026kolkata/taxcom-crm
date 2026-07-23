const fs = require('fs');
let code = fs.readFileSync('src/pages/MessageTemplates.tsx', 'utf8');

// Hide New Template for Staff
code = code.replace(
  '<button\n              onClick={() => openEditor()}\n              className="inline-flex',
  '{!isStaff && (\n            <button\n              onClick={() => openEditor()}\n              className="inline-flex'
);
code = code.replace(
  'New Template\n            </button>',
  'New Template\n            </button>\n            )}'
);

// Hide Delete button in editor (wait, editor save button)
// We already restrict what buttons they see on the cards.

// System templates actions
code = code.replace(
  '<div className="bg-slate-50/50 p-3 flex justify-between items-center gap-2">\n                        <button',
  '<div className="bg-slate-50/50 p-3 flex justify-between items-center gap-2">\n                        {!isStaff && (<>\n                        <button'
);
code = code.replace(
  'Reset to Default\n                              </button>\n                            </div>\n                          )}\n                        </div>\n                      </div>',
  'Reset to Default\n                              </button>\n                            </div>\n                          )}\n                        </div>\n                        </>)}\n                      </div>'
);

// Custom templates actions
code = code.replace(
  '<div className="bg-slate-50/50 p-3 flex justify-between items-center gap-2">\n                        <button\n                          onClick={() => openEditor(tmpl)}\n                          className="flex-1',
  '<div className="bg-slate-50/50 p-3 flex justify-between items-center gap-2">\n                        {!isStaff && (\n                          <>\n                        <button\n                          onClick={() => openEditor(tmpl)}\n                          className="flex-1'
);

code = code.replace(
  'Delete\n                              </button>\n                            </div>\n                          )}\n                        </div>\n                      </div>\n                    </div>\n                  ))',
  'Delete\n                              </button>\n                            </div>\n                          )}\n                        </div>\n                          </>\n                        )}\n                      </div>\n                    </div>\n                  ))'
);

fs.writeFileSync('src/pages/MessageTemplates.tsx', code);
