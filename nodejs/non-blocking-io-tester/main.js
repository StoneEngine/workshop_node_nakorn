import bcrypt from 'bcryptjs';
import express from 'express';

const app = express();
const totalText = 150; // กูขอลดเหลือ 10 นะ เดี๋ยวคอมมึงค้าง
const salt = 10;

// === Test Async (Non-blocking จำลอง) ===
// http://localhost:3000/test-async
app.get('/test-async', async (req, res) => {
  console.log('Processing Async...');
  const start = Date.now();
  const jobs = [];

  for (let i = 0; i < totalText; i++) {
    // bcryptjs แบบ async มันจะพยายาม yield ให้ event loop บ้าง
    jobs.push(bcrypt.hash('password123', salt));
  }

  const results = await Promise.all(jobs);

  const end = Date.now();
  console.log(`Async finished: ${end - start}ms`);
  res.send({ mode: 'Async', time: end - start, count: results.length });
});

// === Test Sync (Blocking นรกแตก) ===
// http://localhost:3000/test-sync
app.get('/test-sync', (req, res) => {
  console.log('Processing Sync...');
  const start = Date.now();
  const results = [];

  for (let i = 0; i < totalText; i++) {
    // ตรงนี้แหละที่ Server จะเป็นอัมพาตจนกว่าจะวนลูปครบ
    const result = bcrypt.hashSync('password123', salt);
    results.push(result);
  }

  const end = Date.now();
  console.log(`Sync finished: ${end - start}ms`);
  res.send({ mode: 'Sync', time: end - start, count: results.length });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});