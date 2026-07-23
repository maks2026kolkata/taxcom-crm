// Mock the environment to test if delete logic works
const storageStr = require('fs').readFileSync('src/db/storage.ts', 'utf8');
console.log("Check if deleteTask calls deleteFromCloud for tasks");
console.log(storageStr.includes("await deleteFromCloud('tasks', id);"));
