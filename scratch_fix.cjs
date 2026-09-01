const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix single quote trailing
    // e.g. `${import.meta.env.VITE_API_URL}/api/dashboard/users'
    // Note: JS string replace with regex that uses backticks can be tricky.
    // The regex matches:  `\$\{import\.meta\.env\.VITE_API_URL\}([^']*)'
    content = content.replace(/`\$\{import\.meta\.env\.VITE_API_URL\}([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    // Fix double quote trailing (just in case)
    content = content.replace(/`\$\{import\.meta\.env\.VITE_API_URL\}([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
