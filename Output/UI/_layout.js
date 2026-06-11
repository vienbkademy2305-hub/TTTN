// Shared layout — included via <script> in each authenticated screen
// Usage: window._AppLayout = AppLayout;  window._MENU = MENU_ITEMS;

const PRIMARY = '#FA8C16';

const MENU_ITEMS = [
  { key: 'home',        icon: '🏠', label: 'Trang chủ',           href: 'MH-DN-02_Dashboard.html' },
  { key: 'profile',     icon: '👤', label: 'Hồ sơ doanh nghiệp',  href: 'MH-DN-03_Profile.html', children: [
    { key: 'profile-info',    label: 'Thông tin DN',     href: 'MH-DN-03_Profile.html?tab=info' },
    { key: 'profile-contact', label: 'Người liên hệ',   href: 'MH-DN-03_Profile.html?tab=contact' },
  ]},
  { key: 'partnership', icon: '🤝', label: 'Hợp tác',             href: 'MH-DN-04_Partnership.html', children: [
    { key: 'partnership-list', label: 'Đề xuất hợp tác', href: 'MH-DN-04_Partnership.html' },
  ]},
  { key: 'news',        icon: '📰', label: 'Tin tức',              href: 'MH-DN-05_News.html', children: [
    { key: 'news-list', label: 'Quản lý bài đăng', href: 'MH-DN-05_News.html' },
  ]},
  { key: 'topics',      icon: '📋', label: 'Đề tài',               href: 'MH-DN-06_Topics.html', children: [
    { key: 'topics-list', label: 'Danh sách đề tài', href: 'MH-DN-06_Topics.html' },
  ]},
  { key: 'internship',  icon: '🎓', label: 'Thực tập',             href: 'MH-DN-07_Internship.html', children: [
    { key: 'internship-review',   label: 'Duyệt hồ sơ',          href: 'MH-DN-07_Internship.html?tab=review' },
    { key: 'internship-students', label: 'Sinh viên thực tập',    href: 'MH-DN-07_Internship.html?tab=students' },
  ]},
];
