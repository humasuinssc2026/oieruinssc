const fs = require('fs');

async function testUpload() {
  const form = new FormData();
  form.append('title', 'Profile PPID');
  form.append('category_slug', 'Kategori Umum');
  form.append('author', 'Ardan Fahroby');
  form.append('mata_kuliah', 'Profile');
  form.append('kode_mata_kuliah', '123456');
  form.append('type', 'video');
  form.append('url', 'https://drive.google.com/file/d/test/view');
  
  // write a dummy file
  fs.writeFileSync('dummy.jpg', 'fake image content');
  const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
  form.append('thumbnail_file', blob, 'dummy.jpg');

  try {
    console.log("Sending request...");
    const response = await fetch('http://localhost:5001/api/materials/upload', {
      method: 'POST',
      body: form
    });
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Network error:", err);
  }
}

testUpload();
