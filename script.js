const VARIANT = 4;
let manualTheme = false;

function collectSystemInfo() {
  const nav = navigator;
  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    appName: nav.appName,
    language: nav.language,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function saveSystemInfo() {
  for (const [key, value] of Object.entries(collectSystemInfo())) {
    localStorage.setItem(key, value);
  }
}

function renderStorageInfo() {
  const list = document.getElementById('storageInfo');
  list.innerHTML = '';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const li = document.createElement('li');
    li.innerHTML = `<b>${key}:</b> ${localStorage.getItem(key)}`;
    list.appendChild(li);
  }
}

async function loadReviews() {
  const status = document.getElementById('reviewsStatus');
  const list = document.getElementById('reviewsList');
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const comments = await response.json();
    comments.forEach(c => {
      const card = document.createElement('article');
      card.className = 'review';
      card.innerHTML = `<h3>${c.name}</h3><div class="email">${c.email}</div><p>${c.body}</p>`;
      list.appendChild(card);
    });
    status.remove();
  } catch (error) {
    status.textContent = 'Не вдалося завантажити відгуки.';
  }
}

function initModal() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modalClose');
  setTimeout(() => { modal.hidden = false; }, 60000); 
  closeBtn.addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
}

function isDayTime(date = new Date()) {
  const h = date.getHours();
  return h >= 7 && h < 21;
}

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  document.getElementById('themeToggle').textContent = dark ? '☀️' : '🌙';
}

function initTheme() {
  applyTheme(!isDayTime());
  document.getElementById('themeToggle').addEventListener('click', () => {
    manualTheme = true;
    applyTheme(!document.body.classList.contains('dark'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  saveSystemInfo();
  renderStorageInfo();
  loadReviews();
  initModal();
  initTheme();
});