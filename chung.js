const KHOA_NGUOI_DUNG = "danhSachNguoiDung";
const KHOA_PHIEU_DANG_NHAP = "nguoiDungHienTai";

function layNguoiDungHienTai() {
    const duLieu = localStorage.getItem(KHOA_PHIEU_DANG_NHAP);

    try {
        return duLieu ? JSON.parse(duLieu) : null;
    } catch (loi) {
        return null;
    }
}

function kiemTraDangNhap() {
    const nguoiDung = layNguoiDungHienTai();

    if (!nguoiDung) {
        window.location.href = "../dang-nhap/dang-nhap.html";
        return null;
    }

    return nguoiDung;
}

function dangXuat() {
    localStorage.removeItem(KHOA_PHIEU_DANG_NHAP);
    window.location.href = "../dang-nhap/dang-nhap.html";
}

function layDanhSachNguoiDung() {
    try {
        return JSON.parse(localStorage.getItem(KHOA_NGUOI_DUNG)) || [];
    } catch (loi) {
        return [];
    }
}

function luuDanhSachNguoiDung(danhSach) {
    localStorage.setItem(
        KHOA_NGUOI_DUNG,
        JSON.stringify(danhSach)
    );
}
