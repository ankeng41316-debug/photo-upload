const form = document.getElementById('upload-form');
const input = document.getElementById('photo');
const preview = document.getElementById('preview');
const message = document.getElementById('message');
const gallery = document.getElementById('gallery');

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) { preview.hidden = true; return; }
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
});

async function loadPhotos() {
  try {
    const res = await fetch('/photos');
    const data = await res.json();
    gallery.replaceChildren(...data.photos.map((url) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = '已上傳的照片';
      return img;
    }));
  } catch (e) {
    showMessage('無法載入照片列表', 'error');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!input.files[0]) return showMessage('請選擇一張照片', 'error');
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const res = await fetch('/upload', { method: 'POST', body: new FormData(form) });
    const data = await res.json();
    showMessage(data.message, data.success ? 'success' : 'error');
    if (data.success) {
      form.reset();
      preview.hidden = true;
      loadPhotos();
    }
  } catch (err) {
    showMessage('上傳失敗，請稍後再試', 'error');
  } finally {
    button.disabled = false;
  }
});

loadPhotos();
