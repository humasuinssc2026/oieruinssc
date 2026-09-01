const http = require('http');
const fs = require('fs');
const path = require('path');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const dummyPdfPath = path.join(__dirname, 'dummy_test.pdf');
fs.writeFileSync(dummyPdfPath, 'Dummy PDF content');

let postData = '';
postData += `--${boundary}\r\n`;
postData += `Content-Disposition: form-data; name="title"\r\n\r\nTest Video\r\n`;
postData += `--${boundary}\r\n`;
postData += `Content-Disposition: form-data; name="type"\r\n\r\nvideo\r\n`;
postData += `--${boundary}\r\n`;
postData += `Content-Disposition: form-data; name="category_slug"\r\n\r\nmateri-umum-fiqih\r\n`;
postData += `--${boundary}\r\n`;
postData += `Content-Disposition: form-data; name="author"\r\n\r\nTester\r\n`;
postData += `--${boundary}\r\n`;
postData += `Content-Disposition: form-data; name="url"\r\n\r\nhttps://youtube.com/watch?v=123\r\n`;
postData += `--${boundary}\r\n`;
postData += `Content-Disposition: form-data; name="document_file"; filename="dummy_test.pdf"\r\n`;
postData += `Content-Type: application/pdf\r\n\r\n`;
postData += fs.readFileSync(dummyPdfPath) + '\r\n';
postData += `--${boundary}--\r\n`;

const req = http.request({
  hostname: 'localhost',
  port: 5001,
  path: '/api/materials/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response:', data);
    fs.unlinkSync(dummyPdfPath);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  fs.unlinkSync(dummyPdfPath);
});

req.write(postData);
req.end();
