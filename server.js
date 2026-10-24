const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' };

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ALLOWED[file.mimetype]}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    ALLOWED[file.mimetype] ? cb(null, true) : cb(new Error('只允許上傳 JPG、PNG、GIF 或 WebP 圖片'))
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: '請選擇一張照片' });
  res.json({ success: true, message: '上傳成功！', url: `/uploads/${req.file.filename}` });
});

app.get('/photos', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).json({ success: false, message: '無法讀取照片列表' });
    const photos = files
      .filter((f) => Object.values(ALLOWED).includes(path.extname(f).toLowerCase()))
      .sort().reverse()
      .map((f) => `/uploads/${f}`);
    res.json({ success: true, photos });
  });
});

app.use((err, req, res, next) => {
  const message = err.code === 'LIMIT_FILE_SIZE' ? '檔案過大（上限 10MB）' : err.message;
  res.status(400).json({ success: false, message });
});

app.listen(PORT, () => console.log(`伺服器運行於 http://localhost:${PORT}`));
