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
    
    // Replace 'http://localhost:5001/api...
    content = content.replace(/'http:\/\/localhost:5001\/api/g, '`${import.meta.env.VITE_API_URL}/api');
    
    // For single-quoted URLs that didn't have backticks, we need to close the backtick instead of single quote
    // Let's just do a simpler replace.
    // Replace 'http://localhost:5001... with `${import.meta.env.VITE_API_URL}...`
    content = content.replace(/'http:\/\/localhost:5001([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    // Replace "http://localhost:5001... with `${import.meta.env.VITE_API_URL}...`
    content = content.replace(/"http:\/\/localhost:5001([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    // Replace `http://localhost:5001... with `${import.meta.env.VITE_API_URL}...`
    // Be careful not to mess up existing template literals
    content = content.replace(/`http:\/\/localhost:5001([^`]*)`/g, '`${import.meta.env.VITE_API_URL}$1`');

    // For cases where http://localhost:5001 is inside an existing template string: 
    // e.g. `http://localhost:5001${mat.thumbnail_url}`
    content = content.replace(/http:\/\/localhost:5001/g, '${import.meta.env.VITE_API_URL}');
    
    // Fix nested template literals: `${import.meta.env.VITE_API_URL}${mat.thumbnail_url}`
    // It's perfectly valid JS.

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
