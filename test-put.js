// test-put.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/cruisies/69bca1369f595d37fe0ebf7b',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});

req.on('error', (e) => console.error(e));
req.write(JSON.stringify({ titleEn: 'Test' }));
req.end();
