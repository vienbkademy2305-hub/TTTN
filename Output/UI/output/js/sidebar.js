const SIDEBAR_SECTIONS = [
  {
    id: 'home',
    icon: '🏠',
    label: 'Tổng quan',
    pages: ['index.html'],
    subnav: [],
  },
  {
    id: 'company',
    icon: '🏢',
    label: 'Doanh nghiệp',
    pages: ['ho-so.html', 'de-xuat-hop-tac.html'],
    subnav: [
      { href: 'ho-so.html', label: '👤 Thông tin & Nhân viên' },
      { href: 'de-xuat-hop-tac.html', label: '🤝 Đề xuất hợp tác' },
    ],
  },
  {
    id: 'news',
    icon: '📰',
    label: 'Tin tức',
    pages: ['tin-tuc.html', 'tao-tin-tuc.html'],
    subnav: [
      { href: 'tin-tuc.html', label: '📋 Danh sách bài đăng' },
      { href: 'tao-tin-tuc.html', label: '✏️ Tạo bài đăng mới' },
    ],
  },
  {
    id: 'topics',
    icon: '📋',
    label: 'Đề tài Thực tập',
    pages: ['de-tai.html', 'tao-de-tai.html', 'kho-de-tai-gv.html'],
    subnav: [
      { href: 'de-tai.html', label: '📄 Đề tài của tôi' },
      { href: 'tao-de-tai.html', label: '➕ Tạo đề tài mới' },
      { href: 'kho-de-tai-gv.html', label: '🔬 Kho đề tài Giảng viên' },
    ],
  },
  {
    id: 'students',
    icon: '👥',
    label: 'Quản lý Sinh viên',
    pages: ['duyet-sv.html', 'quan-ly-sv.html', 'cham-diem.html'],
    subnav: [
      { href: 'duyet-sv.html', label: '✅ Duyệt hồ sơ', badge: '3' },
      { href: 'quan-ly-sv.html', label: '👤 SV đã tiếp nhận' },
      { href: 'cham-diem.html', label: '⭐ Chấm điểm' },
    ],
  },
];

function renderSidebar(currentPage) {
  const activeSection = SIDEBAR_SECTIONS.find(s => s.pages.includes(currentPage));

  const navButtons = SIDEBAR_SECTIONS.map(section => {
    const isActive = section.pages.includes(currentPage);
    const defaultPage = section.pages[0];
    return `
    <a href="${defaultPage}" class="nav-icon-btn${isActive ? ' active' : ''}"
      aria-label="${section.label}" title="">
      <span>${section.icon}</span>
      <span class="nav-tooltip">${section.label}</span>
    </a>`;
  }).join('');

  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">DN</div>
    </div>
    <nav class="sidebar-nav" aria-label="Menu chính">
      ${navButtons}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-sep"></div>
      <button class="nav-icon-btn" aria-label="Cài đặt tài khoản" title="">
        <span>⚙️</span>
        <span class="nav-tooltip">Cài đặt</span>
      </button>
      <a href="dang-ky.html" class="nav-icon-btn" aria-label="Đăng xuất" title="">
        <span>🚪</span>
        <span class="nav-tooltip">Đăng xuất</span>
      </a>
    </div>
  </aside>`;
}

function injectSubnav(currentPage) {
  const section = SIDEBAR_SECTIONS.find(s => s.pages.includes(currentPage));
  if (!section || !section.subnav.length) return;

  const mainContent = document.querySelector('.main-content');
  if (!mainContent || mainContent.querySelector('.page-subnav')) return;

  const tabsHtml = section.subnav.map(tab => {
    const isActive = tab.href === currentPage;
    const badgeHtml = tab.badge ? `<span class="tab-badge">${tab.badge}</span>` : '';
    return `<a href="${tab.href}" class="subnav-tab${isActive ? ' active' : ''}" aria-current="${isActive ? 'page' : 'false'}">${tab.label}${badgeHtml}</a>`;
  }).join('');

  const subnav = document.createElement('div');
  subnav.className = 'page-subnav';
  subnav.setAttribute('role', 'tablist');
  subnav.innerHTML = tabsHtml;
  mainContent.insertBefore(subnav, mainContent.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  const placeholder = document.getElementById('sidebar-placeholder');
  if (placeholder) {
    placeholder.outerHTML = renderSidebar(currentPage);
  }

  injectSubnav(currentPage);
});
