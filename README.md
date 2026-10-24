# photo-upload

簡單的照片上傳網頁應用（Node.js + Express + Multer）。

## 使用方式

```bash
npm install
npm start
```

開啟 http://localhost:3000 ，選擇照片後按「上傳」。照片會存放在 `uploads/` 資料夾，並顯示在下方列表。

- 支援 JPG、PNG、GIF、WebP，單檔上限 10MB
- `POST /upload`（欄位 `photo`）上傳；`GET /photos` 取得照片列表
