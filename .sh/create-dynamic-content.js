const crypto = require('crypto');
const fs = require('fs');

const scriptContent = fs.readFileSync('script.js', 'utf8');
const hash = crypto.createHash('sha384').update(scriptContent).digest('base64');

console.log(hash);