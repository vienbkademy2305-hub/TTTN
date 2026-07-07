let mockData = null;

async function loadMockData() {
  const res = await fetch('data/mock-data.json');
  mockData = await res.json();
  return mockData;
}

function getStatusBadge(status) {
  const map = {
    'Đã duyệt': 'badge-success',
    'Tiếp nhận': 'badge-success',
    'Đã đăng': 'badge-success',
    'Hoạt động': 'badge-success',
    'Đã hoàn tất': 'badge-success',
    'Chờ phê duyệt': 'badge-warning',
    'Chờ duyệt': 'badge-warning',
    'Đã lưu nháp': 'badge-warning',
    'Nháp': 'badge-gray',
    'Chờ GV duyệt': 'badge-info',
    'Chờ hợp tác DN': 'badge-info',
    'Đã có DN hợp tác': 'badge-primary',
    'Từ chối': 'badge-danger',
    'Tạm dừng': 'badge-gray',
    'Chưa chấm': 'badge-gray',
  };
  const cls = map[status] || 'badge-gray';
  return `<span class="badge ${cls}">${status}</span>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatNumber(n) {
  return n.toLocaleString('vi-VN');
}

function showToast(message, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = '0.3s ease'; }, 2800);
  setTimeout(() => toast.remove(), 3200);
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('active');
    });
  });
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });
}

function initCharCounters() {
  document.querySelectorAll('textarea[data-maxlength]').forEach(ta => {
    const max = parseInt(ta.dataset.maxlength);
    const counter = ta.parentElement.querySelector('.char-counter');
    if (!counter) return;
    const update = () => {
      const len = ta.value.length;
      counter.textContent = `${len}/${max}`;
      counter.className = 'char-counter' + (len > max * 0.9 ? ' warn' : '') + (len >= max ? ' over' : '');
      if (len > max) ta.value = ta.value.slice(0, max);
    };
    ta.addEventListener('input', update);
    update();
  });
}

function initSidebarHighlight() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[href]').forEach(item => {
    if (item.getAttribute('href') === currentPage) {
      item.classList.add('active');
    }
  });
}

function initRTE() {
  document.querySelectorAll('.rte-content[contenteditable]').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;'); }
    });
  });
  document.querySelectorAll('.rte-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      const val = btn.dataset.val || null;
      document.execCommand(cmd, false, val);
      btn.closest('.rte-wrapper')?.querySelector('.rte-content')?.focus();
    });
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(el => {
    const val = el.value.trim();
    const errEl = el.parentElement.querySelector('.form-error');
    if (!val) {
      el.classList.add('error');
      if (errEl) errEl.classList.remove('hidden');
      valid = false;
    } else {
      el.classList.remove('error');
      if (errEl) errEl.classList.add('hidden');
    }
  });
  if (!valid) {
    const firstErr = form.querySelector('.error');
    firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return valid;
}

function initCheckboxCards() {
  document.querySelectorAll('.checkbox-card').forEach(card => {
    const cb = card.querySelector('input[type="checkbox"]');
    if (!cb) return;
    card.addEventListener('click', e => {
      if (e.target === cb) return;
      cb.checked = !cb.checked;
      card.classList.toggle('selected', cb.checked);
    });
    card.classList.toggle('selected', cb.checked);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initCharCounters();
  initSidebarHighlight();
  initRTE();
  initCheckboxCards();

  const page = location.pathname.split('/').pop() || 'index.html';
  if (typeof initPage === 'function') {
    loadMockData().then(data => initPage(data));
  }
});
