/* ═══════════════════════════════════════════════════════════════════════════
   Cấu hình phiếu chấm hội đồng — dùng chung MH-PDT-12 (PĐT cấu hình) và MH-GV-08 (thành viên chấm).
   - Mỗi loại hội đồng chỉ có 1 mẫu "Đang dùng"; bật mẫu mới thì mẫu cũ tự "Ngừng dùng".
   - Mẫu được chốt cho hội đồng ở lần lưu điểm đầu tiên; sửa được đến khi khóa điểm.
   - Loại hội đồng chưa có mẫu đang dùng: chấm 1 ô điểm như cũ.
   - Phần III. Nhận xét cố định trên phiếu chấm, không bắt buộc nhập.
   - Mẫu lưu ở localStorage 'pch_mau' (mô phỏng, chưa có backend dùng chung giữa các trang).
   ═══════════════════════════════════════════════════════════════════════════ */
const PCH_LOAI_HD = { danhgia: 'Hội đồng Đánh giá', chamdiem: 'Hội đồng Chấm điểm', phanbien: 'Hội đồng Phản biện' };
const PCH_GHI_CHU_BANG = '(Điểm từng tiêu chí và điểm cuối cùng làm tròn đến 1 chữ số thập phân)';
/* Bố cục phiếu cố định trong code theo loại hội đồng (PĐT chỉ cấu hình tiêu chí, điểm tối đa, nhận xét).
   Loại hội đồng chưa có bố cục ở đây thì chưa tạo được mẫu (VD: Hội đồng Phản biện). */
const PCH_BO_CUC = {
  danhgia: { tieuDe: ['PHIẾU ĐÁNH GIÁ ĐỒ ÁN/KHÓA LUẬN TỐT NGHIỆP', 'CỦA THÀNH VIÊN HỘI ĐỒNG'],
    nhanNguoiCham: 'Người đánh giá', chucDanhKy: 'THÀNH VIÊN HỘI ĐỒNG', truongTuDien: [] },
  chamdiem: { tieuDe: ['PHIẾU CHẤM ĐỒ ÁN/KHÓA LUẬN TỐT NGHIỆP', 'CỦA GIẢNG VIÊN CHẤM #thu_tu_gv_cham (Vòng chấm #vong_cham)'],
    nhanNguoiCham: 'Người chấm', chucDanhKy: 'GIẢNG VIÊN CHẤM #thu_tu_gv_cham', truongTuDien: [{ ma: 'vong_cham', nhan: 'Vòng chấm' }] },
};
function pchBoCuc(m) { return PCH_BO_CUC[m.loaiHD] || PCH_BO_CUC.danhgia; }
const PCH_MAU_BAN_DAU = [
  { id: 'pch-m16', ma: 'QT.ĐT.19.M16', ten: 'Phiếu đánh giá ĐA/KLTN của thành viên hội đồng', loaiHD: 'danhgia', trangThai: 'dung',
    tieuChi: [
      { nd: 'Trình bày nội dung (slide rõ ràng, ngắn gọn, đầy đủ, đúng giờ)', max: 0.5 },
      { nd: 'Trả lời các câu hỏi của giảng viên phản biện', max: 1.5 },
      { nd: 'Trả lời các câu hỏi của thành viên hội đồng', max: 1.5 },
      { nd: 'Tinh thần, thái độ và cách ứng xử', max: 1.0 },
      { nd: 'Thực hiện các nội dung của đề tài (về nội dung chuyên môn và khoa học cũng như về phương pháp nghiên cứu, xử lý vấn đề của ĐAKLTN có gì đúng, sai, có gì mới, mức độ sáng tạo)', max: 4.5 },
      { nd: 'Mối liên hệ với những vấn đề liên quan (cơ sở lý thuyết và các hướng nghiên cứu khác có liên quan)', max: 1.0 },
    ], capNhat: '09/11/2026' },
  { id: 'pch-m17', ma: 'QT.ĐT.19.M17', ten: 'Phiếu chấm ĐA/KLTN của giảng viên chấm', loaiHD: 'chamdiem', trangThai: 'dung',
    tieuChi: [
      { nd: 'Hình thức trình bày quyển, thuyết minh và bản vẽ (theo quy định của Nhà trường, không có lỗi chính tả, ngắn gọn, mạch lạc, súc tích ...)', max: 1.5 },
      { nd: 'Thực hiện các nội dung của đề tài (về nội dung chuyên môn và khoa học cũng như về phương pháp nghiên cứu, xử lý vấn đề của ĐAKLTN có gì đúng, sai, có gì mới, mức độ sáng tạo).', max: 4.5 },
      { nd: 'Mối liên hệ với những vấn đề liên quan (cơ sở lý thuyết và các hướng nghiên cứu khác có liên quan)', max: 2.0 },
      { nd: 'Tính ứng dụng thực tiễn (phạm vi và mức độ ứng dụng, triển vọng của đề tài, tính mới, tính sáng tạo ...)', max: 2.0 },
    ], capNhat: '09/11/2026' },
];

function pchDsMau() {
  try { const d = JSON.parse(localStorage.getItem('pch_mau')); if (Array.isArray(d)) return d; } catch (e) {}
  return JSON.parse(JSON.stringify(PCH_MAU_BAN_DAU));
}
function pchLuuDsMau(ds) { localStorage.setItem('pch_mau', JSON.stringify(ds)); }
/* Mẫu đã có hội đồng chấm theo (MH-GV-08 ghi lại) — không sửa được nữa */
function pchDaDung() { try { return JSON.parse(localStorage.getItem('pch_da_dung')) || []; } catch (e) { return []; } }
function pchDanhDauDaDung(id) { const d = pchDaDung(); if (!d.includes(id)) { d.push(id); localStorage.setItem('pch_da_dung', JSON.stringify(d)); } }
function pchMauDangDung(loaiHD) { return pchDsMau().find(m => m.loaiHD === loaiHD && m.trangThai === 'dung') || null; }
/* Tiêu chí nhiều cấp (tối đa 3 cấp): { nd, max, con:[...] }. Chỉ chấm ở tiêu chí không có con;
   điểm tối đa của tiêu chí cha tự cộng từ các tiêu chí con. */
const PCH_SO_CAP = 3;
function pchMaxNut(t) { return (t.con && t.con.length) ? Math.round(t.con.reduce((a, c) => a + pchMaxNut(c), 0) * 10) / 10 : (+t.max || 0); }
/* Trải phẳng cây: mỗi dòng có stt (1, 1.1, 1.1.1), cấp, là lá hay không, khoảng chỉ số lá của cây con */
function pchPhang(ds, tienTo, cap, out, demLa) {
  out = out || []; demLa = demLa || { n: 0 }; cap = cap || 1;
  ds.forEach((t, i) => {
    const stt = (tienTo ? tienTo + '.' : '') + (i + 1);
    const la = !(t.con && t.con.length);
    const dong = { stt, cap, nd: t.nd, max: pchMaxNut(t), la, tu: demLa.n };
    out.push(dong);
    if (la) demLa.n++; else pchPhang(t.con, stt, cap + 1, out, demLa);
    dong.den = demLa.n - 1;
  });
  return out;
}
function pchLa(m) { return pchPhang(m.tieuChi).filter(d => d.la); }
function pchTongMax(m) { return Math.round(m.tieuChi.reduce((a, t) => a + pchMaxNut(t), 0) * 10) / 10; }
/* CR-20261110-002: Quy tắc làm tròn "Điểm thành phần" (mô phỏng để thử trên UI; thật thì tra theo ngữ cảnh
   sinh viên, không có bản riêng thì dùng bản dùng chung HC-1ca10d5c). Một quy tắc áp cho mọi tầng điểm:
   điểm tiêu chí, điểm cá nhân (tổng phiếu / 1 ô), điểm hội đồng. */
const PCH_QUY_TAC = {
  '1':     { ten: '1 chữ số, làm tròn toán học', tp: 1 },
  '2':     { ten: '2 chữ số, làm tròn toán học', tp: 2 },
  '0.5':   { ten: 'Làm tròn đến 0,5 gần nhất', tp: 1, buoc: 0.5 },
  'khong': { ten: 'Chưa có quy tắc (giữ nguyên điểm)', tp: null },
};
function pchQuyTac() { const k = localStorage.getItem('lt_quy_tac'); return PCH_QUY_TAC[k] ? k : '1'; }
function pchLamTron(v) {
  if (v == null || v === '' || isNaN(v)) return v;
  const q = PCH_QUY_TAC[pchQuyTac()];
  if (q.buoc) return Math.round(v / q.buoc + 1e-9) * q.buoc;
  if (q.tp == null) return +v;
  const f = Math.pow(10, q.tp);
  return Math.round(v * f + 1e-9) / f;
}
/* Hiển thị điểm theo số chữ số của quy tắc (chưa có quy tắc thì giữ nguyên số đã nhập) */
function pchDiem(v) {
  if (v == null || v === '' || isNaN(v)) return '—';
  const q = PCH_QUY_TAC[pchQuyTac()];
  const tp = q.tp == null ? Math.max(1, Math.min((String(+v).split('.')[1] || '').length, 4)) : q.tp;
  return (+v).toFixed(tp).replace('.', ',');
}
function pchBuoc() { const q = PCH_QUY_TAC[pchQuyTac()]; return q.buoc ? q.buoc : q.tp == null ? 'any' : 1 / Math.pow(10, q.tp); }
function pchDemoQuyTac() {
  return `<div class="pch-demo">Demo Quy tắc làm tròn "Điểm thành phần" (CR-20261110-002):
    <select onchange="localStorage.setItem('lt_quy_tac', this.value); location.reload()">${Object.entries(PCH_QUY_TAC).map(([k, q]) =>
      `<option value="${k}" ${k === pchQuyTac() ? 'selected' : ''}>${q.ten}</option>`).join('')}</select> ( bỏ khi dev)</div>`;
}
function pchSo(v) { return (Math.round(v * 10) / 10).toFixed(1).replace('.', ','); }
function pchEsc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
/* Thay mã #thu_tu_gv_cham, #<trường tự điền> trong tiêu đề / chức danh */
function pchThayMa(text, giaTri) {
  return String(text || '').replace(/#([a-zA-Z_]+)/g, (all, ma) => (giaTri && giaTri[ma]) ? giaTri[ma] : '…..');
}
/* ── Tải phiếu Word thật: dựng file Word (.doc dạng HTML, Word mở được) theo bố cục cố định của loại hội đồng ──
   ctx: người chấm, đơn vị, sinh viên, mã SV, ngành, đề tài, thứ tự GV chấm; p: { diem[], tuDien{}, nhanXet } */
function pchTaiPhieu(m, ctx, p) {
  const bc = pchBoCuc(m);
  p = p || { diem: [], tuDien: {}, nhanXet: '' };
  const gt = { thu_tu_gv_cham: ctx.thuTu || '…..', ...p.tuDien };
  Object.keys(gt).forEach(k => { if (!gt[k]) gt[k] = '…..'; });
  const e = pchEsc, cham = ' .......................';
  const dongs = pchPhang(m.tieuChi);
  const so = v => (v == null || isNaN(v)) ? '' : pchDiem(v);
  const diemDong = d => {
    if (d.la) return so(p.diem[d.tu]);
    const con = p.diem.slice(d.tu, d.den + 1);
    return con.length === d.den - d.tu + 1 && con.every(v => v != null && !isNaN(v)) ? pchDiem(pchLamTron(con.reduce((a, b) => a + b, 0))) : '';
  };
  const coDu = dongs.filter(d => d.la).every(d => p.diem[d.tu] != null && !isNaN(p.diem[d.tu]));
  const tong = coDu ? pchDiem(pchLamTron(p.diem.reduce((a, b) => a + b, 0))) : '';
  const now = new Date();
  const td = 'border:1px solid #000;padding:4pt 6pt;vertical-align:middle';
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${e(m.ma)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page Section1{size:21cm 29.7cm;margin:2cm 2cm 2cm 3cm}
div.Section1{page:Section1}
body{font-family:"Times New Roman",serif;font-size:13pt;line-height:1.3}
p{margin:0 0 4pt 0}
table{border-collapse:collapse}
</style></head>
<body><div class="Section1">
<p style="text-align:right;font-style:italic">Mẫu ${e(m.ma)}</p>
<table style="width:100%"><tr>
  <td style="width:42%;text-align:center;vertical-align:top">BỘ GIÁO DỤC VÀ ĐÀO TẠO<br><b><u>TRƯỜNG ĐẠI HỌC PHENIKAA</u></b></td>
  <td style="text-align:center;vertical-align:top"><b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br><b><u>Độc lập - Tự do - Hạnh phúc</u></b></td>
</tr></table>
<p>&nbsp;</p>
<p style="text-align:center;font-weight:bold">${e(pchThayMa(bc.tieuDe[0], gt))}<br>${e(pchThayMa(bc.tieuDe[1], gt))}</p>
<p>&nbsp;</p>
<p><b>I. THÔNG TIN CHUNG</b></p>
<p>${e(bc.nhanNguoiCham)}: ${e(pchTenTrong(ctx.nguoiCham)) || cham}&nbsp;&nbsp;&nbsp;&nbsp;Học hàm, học vị: ${e(pchHocVi(ctx.nguoiCham)) || cham}</p>
<p>Đơn vị công tác: ${e(ctx.donVi) || cham}</p>
<p>Họ tên sinh viên: ${e(ctx.tenSV) || cham}&nbsp;&nbsp;&nbsp;&nbsp;Mã SV: ${e(ctx.maSV) || cham}&nbsp;&nbsp;&nbsp;&nbsp;Ngành: ${e(ctx.nganh) || cham}</p>
<p>Tên đề tài: ${e(ctx.tenDeTai) || cham}</p>
<p><b>II. ĐÁNH GIÁ</b> <i>${e(PCH_GHI_CHU_BANG)}</i></p>
<table style="width:100%">
  <tr><th style="${td};width:8%">TT</th><th style="${td}">Nội dung đánh giá</th><th style="${td};width:13%">Điểm tối đa</th><th style="${td};width:15%">Điểm đánh giá</th></tr>
  ${dongs.map(d => `<tr${d.la ? '' : ' style="font-weight:bold"'}><td style="${td};text-align:center">${d.stt}</td>
    <td style="${td};padding-left:${6 + (d.cap - 1) * 14}pt">${e(d.nd)}</td><td style="${td};text-align:center">${pchSo(d.max)}</td><td style="${td};text-align:center">${diemDong(d)}</td></tr>`).join('')}
  <tr style="font-weight:bold"><td style="${td};text-align:center" colspan="2">Tổng số</td><td style="${td};text-align:center">${pchSo(pchTongMax(m))}</td><td style="${td};text-align:center">${tong}</td></tr>
</table>
<p>&nbsp;</p>
<p><b>III. NHẬN XÉT</b></p>
<p>${p.nhanXet ? e(p.nhanXet).replace(/\n/g, '<br>') : '..................................................................................................................................<br>..................................................................................................................................'}</p>
<p>&nbsp;</p>
<table style="width:100%"><tr><td style="width:45%"></td><td style="text-align:center">
  <i>Hà Nội, ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}</i><br>
  <b>${e(pchThayMa(bc.chucDanhKy, gt))}</b><br><i>(Ký, ghi rõ họ tên)</i><br><br><br><br>${e(ctx.nguoiCham)}
</td></tr></table>
</div></body></html>`;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `PhieuCham_${m.ma.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^\w.-]+/g, '_')}_${ctx.maSV || 'SV'}.doc`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
/* Đọc giá trị đang nhập trên popup (không kiểm tra) để tải phiếu, kể cả khi chưa lưu */
function pchDocTam(m) {
  const diem = [...document.querySelectorAll('.pch-diem')].map(i => i.value === '' ? null : pchLamTron(+i.value));
  const tuDien = {};
  pchBoCuc(m).truongTuDien.forEach(t => { tuDien[t.ma] = (document.getElementById('pch-td-' + t.ma) || {}).value || ''; });
  const nx = document.getElementById('pch-nhanxet');
  return { diem, tuDien, nhanXet: nx ? nx.value.trim() : '' };
}

/* Học hàm, học vị tách từ tên thành viên (mô phỏng hồ sơ tài khoản) */
function pchHocVi(ten) { const r = /^((?:GS|PGS)\.\s*)?(TS|ThS|CN|KS)\.\s*/.exec(ten || ''); return r ? r[0].trim().replace(/\.$/, '.') : ''; }
function pchTenTrong(ten) { return String(ten || '').replace(/^((?:GS|PGS)\.\s*)?(TS|ThS|CN|KS)\.\s*/, ''); }

/* ── Khối phiếu chấm trong popup Chấm điểm (MH-GV-08) ── */
/* anThongTin: chấm hàng loạt — 1 phiếu áp dụng cho nhiều sinh viên nên không hiện thông tin chung */
function pchKhoiPhieu(m, ctx, phieuCu, chiXem, anThongTin) {
  const bc = pchBoCuc(m);
  const gt = { thu_tu_gv_cham: ctx.thuTu || '', ...((phieuCu && phieuCu.tuDien) || {}) };
  const diem = (phieuCu && phieuCu.diem) || [];
  const thong = [
    [bc.nhanNguoiCham, pchTenTrong(ctx.nguoiCham)], ['Học hàm, học vị', pchHocVi(ctx.nguoiCham)], ['Đơn vị công tác', ctx.donVi],
  ]; // thông tin sinh viên, đề tài, ngành hiện ở bảng đầu popup chấm điểm nên không lặp lại ở đây
  const dis = chiXem ? 'disabled' : '';
  return `<div class="pch-phieu">
    ${anThongTin ? '' : '<div class="section-hd">I. Thông tin chung</div>'}
    <div class="pch-dau">${anThongTin ? '' : thong.map(([n, v], i) => `<div class="fi"><label>${pchEsc(n)}</label><input class="fc" value="${pchEsc(v)}" disabled></div>`).join('')}
      ${bc.truongTuDien.map(t => `<div class="fi"><label>${pchEsc(t.nhan)}</label><input class="fc" id="pch-td-${t.ma}" value="${pchEsc(gt[t.ma] || '')}" ${dis}></div>`).join('')}</div>
    <div class="section-hd">II. Đánh giá <span style="font-weight:400;font-style:italic;font-size:12px;color:var(--text-2)">${pchEsc(PCH_GHI_CHU_BANG)}</span></div>
    <table class="mem-tbl pch-tbl"><thead><tr><th style="width:40px;text-align:center">TT</th><th>Nội dung đánh giá</th><th style="width:80px;text-align:center">Điểm tối đa</th><th style="width:100px;text-align:center">Điểm đánh giá ${chiXem ? '' : '<span class="req">*</span>'}</th></tr></thead>
      <tbody>${pchPhang(m.tieuChi).map(d => `<tr class="${d.la ? '' : 'pch-cha'}"><td style="text-align:center">${d.stt}</td>
        <td style="font-size:13px;padding-left:${8 + (d.cap - 1) * 20}px">${pchEsc(d.nd)}</td><td style="text-align:center">${pchSo(d.max)}</td>
        <td style="text-align:center">${d.la
          ? `<input type="number" class="fc pch-diem" data-i="${d.tu}" min="0" max="${d.max}" step="${pchBuoc()}" placeholder="0 – ${pchSo(d.max)}" value="${diem[d.tu] != null ? diem[d.tu] : ''}" oninput="pchCapNhatTong()" onchange="pchKiemTraO(this)" ${dis} style="text-align:center;padding:4px">`
          : `<span class="pch-cha-diem" data-tu="${d.tu}" data-den="${d.den}">—</span>`}</td></tr>`).join('')}
        <tr class="pch-tong"><td colspan="2" style="text-align:center;font-weight:700">Tổng số</td><td style="text-align:center;font-weight:700">${pchSo(pchTongMax(m))}</td><td style="text-align:center;font-weight:700" id="pch-tong">—</td></tr></tbody></table>
    <div class="section-hd">III. Nhận xét</div>
    <textarea class="fc" id="pch-nhanxet" rows="3" maxlength="${PCH_NX_MAX}" oninput="document.getElementById('pch-nx-dem').textContent=this.value.length" ${dis}>${pchEsc((phieuCu && phieuCu.nhanXet) || '')}</textarea>
    <div style="text-align:right;font-size:12px;color:var(--text-3)"><span id="pch-nx-dem">${((phieuCu && phieuCu.nhanXet) || '').length}</span>/${PCH_NX_MAX} ký tự</div>
  </div>`;
}
const PCH_NX_MAX = 500; // nhận xét tối đa 500 ký tự
const PCH_TB03 = 'Vui lòng nhập điểm từng tiêu chí, từ 0 đến điểm tối đa.';
/* Kiểm tra ngay khi rời ô điểm: làm tròn 1 chữ số; ngoài 0..điểm tối đa thì viền đỏ và báo TB-03 */
function pchKiemTraO(inp) {
  if (inp.value === '') { inp.classList.remove('pch-loi'); pchCapNhatTong(); return; }
  const v = pchLamTron(+inp.value); // làm tròn theo quy tắc rồi mới kiểm tra giới hạn
  const max = +inp.max;
  const ok = !isNaN(v) && v >= 0 && v <= max;
  if (!isNaN(v)) inp.value = v;
  inp.classList.toggle('pch-loi', !ok);
  inp.title = ok ? '' : `Điểm từ 0 đến ${pchSo(max)}`;
  if (!ok) showToast(PCH_TB03, 'err');
  pchCapNhatTong();
}
function pchCapNhatTong() {
  const vals = [...document.querySelectorAll('.pch-diem')].map(i => i.value === '' ? null : +i.value);
  document.querySelectorAll('.pch-cha-diem').forEach(el => {
    const con = vals.slice(+el.dataset.tu, +el.dataset.den + 1);
    el.textContent = con.some(v => v === null) ? '—' : pchDiem(pchLamTron(con.reduce((a, b) => a + b, 0)));
  });
  const el = document.getElementById('pch-tong');
  if (!el) return;
  el.textContent = vals.some(v => v === null) ? '—' : pchDiem(pchLamTron(vals.reduce((a, b) => a + b, 0)));
}
/* Đọc phiếu trong popup; trả về null nếu thiếu / sai (đã đánh dấu ô lỗi) */
function pchDocPhieu(m) {
  let loi = false;
  const la = pchLa(m);
  const diem = [...document.querySelectorAll('.pch-diem')].map((inp, i) => {
    const v = inp.value === '' ? NaN : pchLamTron(+inp.value);
    const ok = !isNaN(v) && v >= 0 && v <= la[i].max;
    inp.classList.toggle('pch-loi', !ok);
    if (!ok) loi = true;
    return v;
  });
  const nx = document.getElementById('pch-nhanxet');
  const nhanXet = nx ? nx.value.trim() : '';
  if (loi) return null;
  const tuDien = {};
  pchBoCuc(m).truongTuDien.forEach(t => { tuDien[t.ma] = (document.getElementById('pch-td-' + t.ma) || {}).value || ''; });
  return { mauId: m.id, diem, tuDien, nhanXet, tong: pchLamTron(diem.reduce((a, b) => a + b, 0)) };
}

(function () {
  const st = document.createElement('style');
  st.textContent = `.pch-mau{font-size:12px;color:var(--text-2);margin:4px 0 6px}
  .pch-dau{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 12px}
  .pch-dau .pch-rong{grid-column:1 / -1}
  .pch-dau .fc[disabled],.pch-phieu .fc[disabled]{background:#fafafa;color:var(--text-1,#262626)}
  .pch-tbl td{vertical-align:middle}
  .pch-tong td{background:#fafafa}
  .pch-cha td{font-weight:600;background:#fcfcfc}
  .pch-loi{border-color:var(--error,#ff4d4f)!important}
  .pch-demo{font-size:12px;color:var(--text-2);background:#fffbe6;border:1px dashed #ffe58f;border-radius:6px;padding:6px 10px;margin:0 0 12px;display:inline-flex;gap:6px;align-items:center}
  .pch-demo select{font-size:12px;padding:1px 4px}`;
  document.head.appendChild(st);
})();
