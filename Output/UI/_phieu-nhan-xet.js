/* ═══════════════════════════════════════════════════════════════════════════
   CR-20261109-002 — Phiếu nhận xét GVHD, GVPB điền trực tiếp trên hệ thống.
   Dùng chung cho MH-GV-06, MH-DATN-01, MH-KCM-07, MH-PDT-10.
   - Mẫu phiếu do PĐT soạn ở màn Quản lý biểu mẫu (mh-admin-02), nhóm đơn hệ thống
     "Phiếu nhận xét GVHD" / "Phiếu nhận xét GVPB". Ở đây mô phỏng bằng PNX_MAU.
   - GV nộp 1 lần, không Lưu nháp; nộp xong chỉ xem.
   - Kết luận lấy từ trường mã ketLuanBaoVe; mẫu thiếu trường này thì SV coi như chưa nhận xét.
   - Phiếu lưu ở s.phieuNX[who]; s.nxGVHD / s.nxGVPB chỉ có khi phiếu có kết luận.
   ═══════════════════════════════════════════════════════════════════════════ */
const PNX_VAI = {
  gvhd: { nhom: 'Phiếu nhận xét GVHD', nhan: 'GVHD', chucDanh: 'GIẢNG VIÊN HƯỚNG DẪN', nxKey: 'nxGVHD' },
  gvpb: { nhom: 'Phiếu nhận xét GVPB', nhan: 'GVPB', chucDanh: 'GIẢNG VIÊN PHẢN BIỆN', nxKey: 'nxGVPB' },
};
const PNX_KET_LUAN = { ma: 'ketLuanBaoVe', nhan: 'IV. Kết luận', kieu: 'select', batBuoc: true, luaChon: ['Đồng ý cho bảo vệ', 'Không đồng ý cho bảo vệ'] };
const PNX_FILE = { ma: 'phieuDaKy', nhan: 'Phiếu đã ký (nếu có)', kieu: 'file', batBuoc: false };
const PNX_MAU = {
  gvhd: [
    { ma: 'QT.ĐT.19.M08', ten: 'Nhận xét ĐA/KLTN của giảng viên hướng dẫn',
      dauPhieu: [['Giảng viên hướng dẫn', 'gv_ho_ten'], ['Bộ môn', 'gv_bo_mon'], ['Tên đề tài', 'ten_de_tai'], ['Sinh viên thực hiện', 'ho_ten'], ['Lớp', 'lop']],
      truong: [
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'hinhThuc', nhan: 'Nhận xét về hình thức', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'tinhCapThiet', nhan: 'Tính cấp thiết của đề tài', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'mucTieu', nhan: 'Mục tiêu của đề tài', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'noiDung', nhan: 'Nội dung của đề tài', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'taiLieu', nhan: 'Tài liệu tham khảo', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'phuongPhap', nhan: 'Phương pháp nghiên cứu', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'sangTao', nhan: 'Tính sáng tạo và ứng dụng', kieu: 'textarea' },
        { muc: 'II. Nhận xét tinh thần và thái độ làm việc của sinh viên', ma: 'tinhThan', nhan: '', kieu: 'textarea' },
        { muc: 'III. Kết quả đạt được', ma: 'ketQua', nhan: '', kieu: 'textarea', batBuoc: true },
        PNX_KET_LUAN, PNX_FILE,
      ] },
    { ma: 'QT.ĐT.19.M08 (sửa đổi 2026)', ten: 'Nhận xét ĐA/KLTN của giảng viên hướng dẫn — bản sửa đổi 2026',
      dauPhieu: [['Giảng viên hướng dẫn', 'gv_ho_ten'], ['Bộ môn', 'gv_bo_mon'], ['Tên đề tài', 'ten_de_tai'], ['Sinh viên thực hiện', 'ho_ten'], ['Lớp', 'lop']],
      truong: [
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'hinhThuc', nhan: 'Nhận xét về hình thức', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'noiDung', nhan: 'Nội dung của đề tài', kieu: 'textarea' },
        { muc: 'II. Kết quả đạt được', ma: 'ketQua', nhan: '', kieu: 'textarea', batBuoc: true },
        PNX_KET_LUAN, PNX_FILE,
      ] },
  ],
  gvpb: [
    { ma: 'QT.ĐT.19.M09', ten: 'Nhận xét ĐA/KLTN của giảng viên phản biện',
      dauPhieu: [['Giảng viên phản biện', 'gv_ho_ten'], ['Bộ môn', 'gv_bo_mon'], ['Tên đề tài', 'ten_de_tai'], ['Sinh viên thực hiện', 'ho_ten'], ['Lớp', 'lop'], ['Giảng viên hướng dẫn', 'gvhd']],
      truong: [
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'boCuc', nhan: 'Bố cục, hình thức trình bày', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'tinhCapThiet', nhan: 'Đảm bảo tính cấp thiết, hiện đại, không trùng lặp', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'noiDung', nhan: 'Nội dung', kieu: 'textarea' },
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'mucDo', nhan: 'Mức độ thực hiện', kieu: 'textarea' },
        { muc: 'II. Kết quả đạt được', ma: 'ketQua', nhan: '', kieu: 'textarea', batBuoc: true },
        { muc: 'III. Ưu nhược điểm', ma: 'uuNhuoc', nhan: '', kieu: 'textarea' },
        PNX_KET_LUAN, PNX_FILE,
      ] },
    { ma: 'QT.ĐT.19.M09 (sửa đổi 2026)', ten: 'Nhận xét ĐA/KLTN của giảng viên phản biện — bản sửa đổi 2026',
      dauPhieu: [['Giảng viên phản biện', 'gv_ho_ten'], ['Bộ môn', 'gv_bo_mon'], ['Tên đề tài', 'ten_de_tai'], ['Sinh viên thực hiện', 'ho_ten'], ['Lớp', 'lop'], ['Giảng viên hướng dẫn', 'gvhd']],
      truong: [
        { muc: 'I. Nhận xét ĐAKLTN', ma: 'noiDung', nhan: 'Nội dung', kieu: 'textarea' },
        { muc: 'II. Kết quả đạt được', ma: 'ketQua', nhan: '', kieu: 'textarea', batBuoc: true },
        { muc: 'III. Ưu nhược điểm', ma: 'uuNhuoc', nhan: '', kieu: 'textarea' },
        PNX_KET_LUAN, PNX_FILE,
      ] },
  ],
};
const PNX_TB01 = 'Nội dung nhận xét chưa được nộp sẽ bị mất. Bạn có chắc muốn đóng?';
const PNX_TB02 = 'PĐT chưa cài đặt mẫu nhận xét';
const PNX_TB03 = 'Sau khi nộp, bạn sẽ không sửa được phiếu nhận xét. Bạn có chắc muốn nộp?';

/* Mô phỏng số mẫu đang hoạt động trong mỗi nhóm (0 / 1 / 2) — chỉ để demo ( bỏ khi dev) */
function pnxSoMau(who) {
  let d = {}; try { d = JSON.parse(localStorage.getItem('pnx_demo_so_mau')) || {}; } catch (e) {}
  return d[who] == null ? 1 : d[who];
}
function pnxDatSoMau(who, n) {
  let d = {}; try { d = JSON.parse(localStorage.getItem('pnx_demo_so_mau')) || {}; } catch (e) {}
  d[who] = +n; localStorage.setItem('pnx_demo_so_mau', JSON.stringify(d));
}
function pnxMauDangDung(who) { return PNX_MAU[who].slice(0, pnxSoMau(who)); }
function pnxDemoBar() {
  const opt = who => [0, 1, 2].map(n => `<option value="${n}" ${pnxSoMau(who) === n ? 'selected' : ''}>${n}</option>`).join('');
  return `<div class="pnx-demo">Demo số mẫu phiếu nhận xét đang hoạt động: GVHD <select onchange="pnxDatSoMau('gvhd',this.value)">${opt('gvhd')}</select>
    GVPB <select onchange="pnxDatSoMau('gvpb',this.value)">${opt('gvpb')}</select> ( bỏ khi dev)</div>`;
}

function pnxPhieu(s, who) { return (s.phieuNX && s.phieuNX[who]) || null; }
function pnxEsc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function pnxDauPhieu(s, who, gv) {
  return {
    ho_ten: s.tenSV || '', lop: s.lop || '', ten_de_tai: (s.topic && s.topic.name) || s.tenDeTai || '',
    gvhd: s.gvhd || '', gv_ho_ten: gv.ten || '', gv_bo_mon: gv.boMon || '',
  };
}

/* Dữ liệu mẫu: nhận xét có sẵn chuyển sang dạng phiếu theo mẫu đầu tiên của nhóm */
function pnxChuanHoa(list) {
  list.forEach(s => {
    ['gvhd', 'gvpb'].forEach(who => {
      const nx = s[PNX_VAI[who].nxKey];
      if (!nx || pnxPhieu(s, who)) return;
      const mau = PNX_MAU[who][0];
      const giaTri = {};
      mau.truong.forEach(t => { if (t.kieu === 'textarea') giaTri[t.ma] = ''; });
      giaTri.ketQua = nx.noiDung || 'Hoàn thành các nội dung đề ra, sản phẩm đáp ứng yêu cầu.';
      if ('hinhThuc' in giaTri) giaTri.hinhThuc = 'Trình bày đúng quy định, rõ ràng.';
      if ('boCuc' in giaTri) giaTri.boCuc = 'Bố cục hợp lý, trình bày rõ ràng.';
      giaTri.ketLuanBaoVe = nx.ketLuan === 'Đồng ý' ? 'Đồng ý cho bảo vệ' : 'Không đồng ý cho bảo vệ';
      const gvTen = who === 'gvhd' ? s.gvhd : s.gvpb;
      s.phieuNX = s.phieuNX || {};
      s.phieuNX[who] = { maMau: mau.ma, mau, giaTri, file: '', ngayNop: nx.ngay || '',
        dauPhieu: pnxDauPhieu(s, who, { ten: gvTen, boMon: 'Bộ môn Công nghệ phần mềm' }) };
    });
  });
}

/* ── Hộp xác nhận riêng, luôn nằm trên popup phiếu ── */
function pnxXacNhan(msg, onOk, okText) {
  let o = document.getElementById('pnx-confirm');
  if (!o) {
    o = document.createElement('div');
    o.id = 'pnx-confirm'; o.className = 'overlay hidden pnx-ov'; o.style.zIndex = 1100;
    o.innerHTML = `<div class="confirm-box"><div class="confirm-title" id="pnx-confirm-msg"></div>
      <div class="confirm-actions"><button class="btn btn-default" id="pnx-confirm-huy">Hủy</button><button class="btn btn-primary" id="pnx-confirm-ok"></button></div></div>`;
    document.body.appendChild(o);
  }
  document.getElementById('pnx-confirm-msg').textContent = msg;
  document.getElementById('pnx-confirm-ok').textContent = okText;
  document.getElementById('pnx-confirm-huy').onclick = () => o.classList.add('hidden');
  document.getElementById('pnx-confirm-ok').onclick = () => { o.classList.add('hidden'); onOk(); };
  o.classList.remove('hidden');
}

/* ── Popup phiếu: mode 'edit' (GV điền) hoặc 'view' (chỉ đọc) ── */
let _pnx = null;
function pnxKhung() {
  let o = document.getElementById('pnx-m');
  if (!o) {
    o = document.createElement('div');
    o.id = 'pnx-m'; o.className = 'overlay hidden pnx-ov'; o.style.zIndex = 1050;
    o.innerHTML = `<div class="modal-box w700" style="max-height:90vh">
      <div class="modal-hd"><span class="modal-title" id="pnx-title"></span><button class="modal-close" onclick="pnxDong()">✕</button></div>
      <div class="modal-bd" style="overflow-y:auto" id="pnx-bd"></div>
      <div class="modal-ft" id="pnx-ft"></div></div>`;
    document.body.appendChild(o);
  }
  return o;
}
function pnxMo(opt) {
  const { s, who, mode } = opt;
  if (mode === 'view') {
    const p = pnxPhieu(s, who);
    if (!p) return;
    _pnx = { ...opt, phieu: p, mau: p.mau, dirty: false };
    return pnxVe();
  }
  const ds = pnxMauDangDung(who);
  if (!ds.length) { showToast(PNX_TB02, 'warn'); return; }
  if (ds.length === 1) return pnxBatDau(opt, ds[0]);
  pnxChonMau(opt, ds);
}
function pnxChonMau(opt, ds) {
  let o = document.getElementById('pnx-chon');
  if (!o) {
    o = document.createElement('div');
    o.id = 'pnx-chon'; o.className = 'overlay hidden pnx-ov'; o.style.zIndex = 1050;
    document.body.appendChild(o);
  }
  o.innerHTML = `<div class="modal-box" style="width:480px">
    <div class="modal-hd"><span class="modal-title">Chọn mẫu phiếu nhận xét ${PNX_VAI[opt.who].nhan}</span><button class="modal-close" onclick="document.getElementById('pnx-chon').classList.add('hidden')">✕</button></div>
    <div class="modal-bd">${ds.map((m, i) => `<label class="pnx-chon-item"><input type="radio" name="pnx-chon" value="${i}" ${i === 0 ? 'checked' : ''}> <b>${pnxEsc(m.ma)}</b> — ${pnxEsc(m.ten)}</label>`).join('')}</div>
    <div class="modal-ft"><button class="btn btn-default" onclick="document.getElementById('pnx-chon').classList.add('hidden')">Hủy</button>
      <button class="btn btn-primary" id="pnx-chon-ok">Tiếp tục</button></div></div>`;
  document.getElementById('pnx-chon-ok').onclick = () => {
    const i = +o.querySelector('input[name=pnx-chon]:checked').value;
    o.classList.add('hidden');
    pnxBatDau(opt, ds[i]);
  };
  o.classList.remove('hidden');
}
function pnxBatDau(opt, mau) {
  _pnx = { ...opt, mau, phieu: null, giaTri: {}, file: '', dirty: false,
    dauPhieu: pnxDauPhieu(opt.s, opt.who, opt.gv || {}) };
  pnxVe();
}
function pnxVe() {
  const o = pnxKhung();
  const { who, mode, mau } = _pnx;
  const xem = mode === 'view';
  const dau = xem ? _pnx.phieu.dauPhieu : _pnx.dauPhieu;
  const gt = xem ? _pnx.phieu.giaTri : _pnx.giaTri;
  document.getElementById('pnx-title').innerHTML = `${who === 'gvhd' ? '📝' : '📃'} Phiếu nhận xét ${PNX_VAI[who].nhan}`;
  let html = `<div class="pnx-mau">Mẫu ${pnxEsc(mau.ma)} — ${pnxEsc(mau.ten)}</div>
    <div class="pnx-dau">${mau.dauPhieu.map(([nhan, ma]) => `<div class="fi${ma === 'ten_de_tai' ? ' pnx-dau-rong' : ''}"><label>${nhan}</label><input class="fc" value="${pnxEsc(dau[ma])}" disabled></div>`).join('')}</div>`;
  let mucTruoc = null;
  mau.truong.forEach(t => {
    const req = t.batBuoc && !xem ? ' <span class="req">*</span>' : '';
    if (t.muc && t.muc !== mucTruoc) { html += `<div class="pnx-muc">${pnxEsc(t.muc)}${t.nhan ? '' : req}</div>`; mucTruoc = t.muc; }
    if (!t.muc) mucTruoc = null;
    if (t.kieu === 'textarea') {
      html += `<div class="fi pnx-fi">${t.nhan ? `<label>${pnxEsc(t.nhan)}${req}</label>` : ''}`
        + (xem ? `<div class="pnx-doc">${pnxEsc(gt[t.ma]) || '<span style="color:var(--text-3)">—</span>'}</div>`
               : `<textarea class="fc" rows="2" data-pnx="${t.ma}" oninput="pnxNhap(this)">${pnxEsc(gt[t.ma])}</textarea>`) + '</div>';
    } else if (t.kieu === 'select') {
      html += `<div class="pnx-muc">${pnxEsc(t.nhan)}${req}</div><div class="fi pnx-fi" data-pnx-wrap="${t.ma}">`
        + (xem
          ? `<input class="fc pnx-kl-xem" value="${pnxEsc(gt[t.ma]) || '—'}" disabled>`
          : `<select class="fc" onchange="pnxNhap(this,'${t.ma}')"><option value="">-- Chọn ${pnxEsc(t.nhan.replace(/^[IVX]+\.\s*/, '').toLowerCase())} --</option>`
            + t.luaChon.map(c => `<option value="${pnxEsc(c)}" ${gt[t.ma] === c ? 'selected' : ''}>${pnxEsc(c)}</option>`).join('') + '</select>')
        + '</div>';
    } else if (t.kieu === 'file') {
      const f = xem ? _pnx.phieu.file : _pnx.file;
      html += `<div class="fi pnx-fi"><label>${pnxEsc(t.nhan)}</label>`
        + (xem ? `<div class="pnx-doc">${f ? '📎 ' + pnxEsc(f) : '<span style="color:var(--text-3)">Không có</span>'}</div>`
               : `<div style="display:flex;gap:8px;align-items:center"><input type="file" id="pnx-file" accept=".pdf,.doc,.docx" style="display:none" onchange="pnxChonFile(this)">
                  <button type="button" class="btn btn-default btn-sm" onclick="document.getElementById('pnx-file').click()">📎 Chọn file</button>
                  <span style="font-size:12px;color:${f ? 'var(--primary)' : 'var(--text-2)'}" id="pnx-file-ten">${f ? '📎 ' + pnxEsc(f) : 'Chưa có file'}</span></div>`) + '</div>';
    }
  });
  document.getElementById('pnx-bd').innerHTML = html;
  document.getElementById('pnx-ft').innerHTML = xem
    ? `<button class="btn btn-default" onclick="pnxXemTruoc()">📄 Xem trước</button><button class="btn btn-default" style="margin-right:auto" onclick="pnxTaiPhieu()">📥 Tải phiếu</button><button class="btn btn-default" onclick="pnxDong()">Đóng</button>`
    : `<button class="btn btn-default" style="margin-right:auto" onclick="pnxXemTruoc()">📄 Xem trước phiếu</button><button class="btn btn-default" onclick="pnxDong()">Hủy</button><button class="btn btn-primary" onclick="pnxNop()">Nộp</button>`;
  o.classList.remove('hidden');
}
function pnxNhap(el, ma) {
  _pnx.giaTri[ma || el.dataset.pnx] = el.value;
  _pnx.dirty = true;
  (el.closest('.pnx-fi') || el).classList.remove('pnx-loi');
}
function pnxChonFile(input) {
  _pnx.file = input.files[0] ? input.files[0].name : '';
  _pnx.dirty = true;
  const el = document.getElementById('pnx-file-ten');
  el.textContent = _pnx.file ? '📎 ' + _pnx.file : 'Chưa có file';
  el.style.color = _pnx.file ? 'var(--primary)' : 'var(--text-2)';
}
function pnxDong() {
  const o = document.getElementById('pnx-m');
  if (_pnx && _pnx.mode === 'edit' && _pnx.dirty) {
    return pnxXacNhan(PNX_TB01, () => { o.classList.add('hidden'); _pnx = null; }, 'Đóng');
  }
  o.classList.add('hidden'); _pnx = null;
}
function pnxNop() {
  let loi = null;
  _pnx.mau.truong.forEach(t => {
    if (!t.batBuoc) return;
    const v = (_pnx.giaTri[t.ma] || '').trim();
    if (v) return;
    const el = t.kieu === 'select' ? document.querySelector(`[data-pnx-wrap="${t.ma}"]`) : document.querySelector(`[data-pnx="${t.ma}"]`);
    if (el) { (el.closest('.pnx-fi') || el).classList.add('pnx-loi'); loi = loi || el; }
  });
  if (loi) { loi.scrollIntoView({ block: 'center' }); return; }
  pnxXacNhan(PNX_TB03, () => {
    const p = { maMau: _pnx.mau.ma, mau: _pnx.mau, giaTri: { ..._pnx.giaTri }, file: _pnx.file,
      ngayNop: new Date().toLocaleDateString('vi'), dauPhieu: _pnx.dauPhieu };
    const kl = p.giaTri.ketLuanBaoVe;
    const ketLuan = kl === 'Đồng ý cho bảo vệ' ? 'Đồng ý' : kl === 'Không đồng ý cho bảo vệ' ? 'Không đồng ý' : null;
    const cb = _pnx.onSubmit;
    document.getElementById('pnx-m').classList.add('hidden'); _pnx = null;
    cb(p, ketLuan);
  }, 'Nộp');
}

/* ── Xem trước phiếu theo đúng mẫu, có nút Tải phiếu (mô phỏng) ── */
function pnxXemTruoc() {
  const xem = _pnx.mode === 'view';
  const mau = _pnx.mau, who = _pnx.who;
  const dau = xem ? _pnx.phieu.dauPhieu : _pnx.dauPhieu;
  const gt = xem ? _pnx.phieu.giaTri : _pnx.giaTri;
  const d = new Date(); // ngayHienTai
  let body = '', mucTruoc = null;
  mau.truong.forEach(t => {
    if (t.kieu === 'file') return;
    if (t.kieu === 'select') {
      body += `<p style="margin-top:10px"><b>${pnxEsc(t.nhan)}:</b> ${t.luaChon.map(c => `${pnxEsc(c)}: ${gt[t.ma] === c ? '☑' : '☐'}`).join('&nbsp;&nbsp;&nbsp;&nbsp;')}</p>`;
      return;
    }
    if (t.muc && t.muc !== mucTruoc) { body += `<p style="margin-top:10px"><b>${pnxEsc(t.muc)}:</b></p>`; mucTruoc = t.muc; }
    body += `<p>${t.nhan ? '- ' + pnxEsc(t.nhan) + ': ' : ''}${pnxEsc(gt[t.ma]) || '…………………………………………………………'}</p>`;
  });
  let o = document.getElementById('pnx-xt');
  if (!o) {
    o = document.createElement('div');
    o.id = 'pnx-xt'; o.className = 'overlay hidden pnx-ov'; o.style.zIndex = 1060;
    document.body.appendChild(o);
  }
  o.innerHTML = `<div class="modal-box w800" style="max-height:92vh">
    <div class="modal-hd"><span class="modal-title">📄 Xem trước phiếu — ${pnxEsc(mau.ma)}</span><button class="modal-close" onclick="document.getElementById('pnx-xt').classList.add('hidden')">✕</button></div>
    <div class="modal-bd" style="overflow-y:auto;background:#f0f0f0"><div class="pnx-giay">
      <div style="text-align:right;font-style:italic">Mẫu ${pnxEsc(mau.ma)}</div>
      <div style="display:flex;justify-content:space-between;text-align:center;margin:6px 0 18px">
        <div>BỘ GIÁO DỤC VÀ ĐÀO TẠO<br><b><u>TRƯỜNG ĐẠI HỌC PHENIKAA</u></b></div>
        <div><b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br><b><u>Độc lập - Tự do - Hạnh phúc</u></b></div></div>
      <div style="text-align:center;font-weight:700;margin-bottom:14px">NHẬN XÉT ĐỒ ÁN/KHÓA LUẬN TỐT NGHIỆP<br>CỦA ${PNX_VAI[who].chucDanh}</div>
      ${mau.dauPhieu.map(([nhan, ma]) => `<p>${nhan}: ${pnxEsc(dau[ma]) || '……………………'}</p>`).join('')}
      <div style="text-align:center;margin:14px 0 4px">NỘI DUNG NHẬN XÉT</div>
      ${body}
      <div style="margin:22px 0 0 50%;text-align:center"><i>Hà Nội, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}</i><br>
        <b>${PNX_VAI[who].chucDanh}</b><br><i>(Ký, ghi rõ họ tên)</i><br><br><br>${pnxEsc(dau.gv_ho_ten)}</div>
    </div></div>
    <div class="modal-ft"><button class="btn btn-default" onclick="document.getElementById('pnx-xt').classList.add('hidden')">Đóng</button></div></div>`;
  o.classList.remove('hidden');
}

function pnxTaiPhieu() { showToast(`Đang tải phiếu ${_pnx.mau.ma} (.docx) — mô phỏng`); }

/* Bấm ra ngoài popup đang điền: hỏi TB-01 thay vì đóng ngay (_utils.js đóng mọi .overlay khi bấm nền) */
document.addEventListener('click', e => {
  if (e.target.id === 'pnx-m') { e.stopImmediatePropagation(); pnxDong(); }
}, true);

(function () {
  const st = document.createElement('style');
  st.textContent = `.pnx-mau{font-size:12px;color:var(--text-2);margin-bottom:10px}
  .pnx-dau{display:grid;grid-template-columns:1fr 1fr;gap:0 16px;margin-bottom:6px}
  .pnx-dau .pnx-dau-rong{grid-column:1 / -1}
  .pnx-dau .fc[disabled]{background:#fafafa;color:var(--text-1,#262626)}
  .pnx-muc{font-weight:600;font-size:13px;margin:12px 0 6px}
  .pnx-fi{margin-bottom:10px}
  .pnx-fi.pnx-loi textarea,.pnx-fi.pnx-loi select{border-color:var(--error,#ff4d4f)}
  .pnx-kl-xem[disabled]{background:#fafafa;color:var(--text-1,#262626)}
  .pnx-kl{display:flex;gap:24px;padding:6px 8px}
  .pnx-kl-o{display:inline-flex;align-items:center;gap:6px;font-size:13px;cursor:pointer}
  .pnx-doc{font-size:13px;padding:6px 10px;background:#fafafa;border:1px solid var(--border);border-radius:6px;white-space:pre-wrap}
  .pnx-chon-item{display:flex;gap:8px;align-items:center;padding:8px 4px;font-size:13px;cursor:pointer}
  .pnx-giay{background:#fff;max-width:640px;margin:0 auto;padding:36px 44px;font-family:'Times New Roman',serif;font-size:14px;line-height:1.55;box-shadow:0 1px 4px rgba(0,0,0,.15)}
  .pnx-giay p{margin:2px 0}
  .pnx-demo{font-size:12px;color:var(--text-2);background:#fffbe6;border:1px dashed #ffe58f;border-radius:6px;padding:6px 10px;margin:8px 0;display:inline-flex;gap:6px;align-items:center}
  .pnx-demo select{font-size:12px;padding:1px 4px}`;
  document.head.appendChild(st);
})();
