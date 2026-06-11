/* =============================================
   Shared utilities — HTQT Đại học
============================================= */

// ── Toast ──
function showToast(msg, type='ok') {
  let box = document.getElementById('toast-box');
  if (!box) { box = document.createElement('div'); box.id = 'toast-box'; box.className = 'toast-box'; document.body.appendChild(box); }
  const t = document.createElement('div');
  const ico = type==='ok' ? '✅' : type==='err' ? '❌' : '⚠️';
  t.className = 'toast' + (type==='err'?' err':type==='warn'?' warn':'');
  t.innerHTML = `<span>${ico}</span><span>${msg}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(-8px)'; t.style.transition='all .3s'; setTimeout(()=>t.remove(),300); }, 2500);
}

// ── Modal ──
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('hidden'); el.style.opacity='0'; requestAnimationFrame(()=>{ el.style.transition='opacity .2s'; el.style.opacity='1'; }); }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.style.opacity='0'; setTimeout(()=>el.classList.add('hidden'),200); }
}
// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('overlay')) {
    e.target.classList.add('hidden');
  }
});
// Close modal via [data-close] buttons
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-close]');
  if (btn) closeModal(btn.getAttribute('data-close'));
});

// ── Confirm dialog ──
function showConfirm(message, onOk, okText='Xác nhận', okClass='btn-primary') {
  let overlay = document.getElementById('confirm-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirm-overlay';
    overlay.className = 'overlay hidden';
    overlay.innerHTML = `<div class="confirm-box">
      <div class="confirm-title" id="conf-title"></div>
      <div class="confirm-desc" id="conf-desc"></div>
      <div class="confirm-actions">
        <button class="btn btn-default" onclick="closeModal('confirm-overlay')">Huỷ</button>
        <button class="btn" id="conf-ok"></button>
      </div></div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById('conf-title').textContent = message;
  document.getElementById('conf-desc').textContent = '';
  const okBtn = document.getElementById('conf-ok');
  okBtn.textContent = okText;
  okBtn.className = 'btn ' + okClass;
  okBtn.onclick = () => { closeModal('confirm-overlay'); onOk(); };
  openModal('confirm-overlay');
}

// ── Tabs ──
function initTabs() {
  document.querySelectorAll('.tabs-nav').forEach(nav => {
    nav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        const container = btn.closest('.tab-container') || document;
        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        container.querySelectorAll('.tab-pane').forEach(p => {
          p.classList.toggle('active', p.id === target);
        });
      });
    });
  });
}

// ── Sidebar groups toggle ──
function initSidebar() {
  document.querySelectorAll('.mn-group').forEach(g => {
    g.addEventListener('click', () => {
      const sub = g.parentElement.querySelector('.sb-sub');
      if (sub) sub.classList.toggle('open');
    });
  });
}

// ── Password toggle ──
function initPasswordToggle() {
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = btn.parentElement.querySelector('input');
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });
}

// ── Char count for textarea ──
function initCharCount() {
  document.querySelectorAll('[data-maxlength]').forEach(el => {
    const max = parseInt(el.getAttribute('data-maxlength'));
    const hint = el.parentElement.querySelector('.f-hint');
    if (!hint) return;
    const update = () => hint.textContent = `${el.value.length} / ${max}`;
    update();
    el.addEventListener('input', update);
    if (el.value.length > max) el.style.borderColor = 'var(--error)';
  });
}

// ── Simple search filter for tables ──
function filterTable(inputId, tableId) {
  const inp = document.getElementById(inputId);
  const tbl = document.getElementById(tableId);
  if (!inp || !tbl) return;
  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase();
    tbl.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ── Init all on DOMContentLoaded ──
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSidebar();
  initPasswordToggle();
  initCharCount();
});
