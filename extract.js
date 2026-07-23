const fs = require('fs');

try {
  let js = fs.readFileSync('dist/assets/index-DaQtan_w.js', 'utf8');
  // the file is minified, so we can search for a string like "Your account is still pending Admin approval."
  // or just copy the file and use a beautifier to get the missing parts.
} catch (e) {}
