
const formDangNhap = document.getElementById("formDangNhap");
const oEmail = document.getElementById("email");
const oMatKhau = document.getElementById("matKhau");

const nutHienMatKhau = document.getElementById("nutHienMatKhau");
const nutDangNhap = document.getElementById("nutDangNhap");

const loiEmail = document.getElementById("loiEmail");
const loiMatKhau = document.getElementById("loiMatKhau");
const thongBao = document.getElementById("thongBao");

// HIỆN / ẨN MẬT KHẨU
nutHienMatKhau.addEventListener("click", function () {
    const dangAn = oMatKhau.type === "password";

    oMatKhau.type = dangAn ? "text" : "password";
    nutHienMatKhau.textContent = dangAn ? "Ẩn" : "Hiện";

    nutHienMatKhau.setAttribute(
        "aria-label",
        dangAn ? "Ẩn mật khẩu" : "Hiện mật khẩu"
    );

    nutHienMatKhau.setAttribute(
        "aria-pressed",
        String(dangAn)
    );
});

// HIỂN THỊ THÔNG BÁO
function hienThongBao(noiDung, loai) {
    thongBao.textContent = noiDung;
    thongBao.className = "thong-bao " + loai;
    thongBao.hidden = false;
}

function anThongBao() {
    thongBao.textContent = "";
    thongBao.hidden = true;
    thongBao.className = "thong-bao";
}

// XÓA LỖI CŨ KHI NGƯỜI DÙNG NHẬP LẠI
function xoaLoi(truongNhap, noiBaoLoi) {
    noiBaoLoi.textContent = "";

    const khungNhap = truongNhap.closest(".o-nhap");

    if (khungNhap) {
        khungNhap.classList.remove("co-loi");
    }
}

function hienLoi(truongNhap, noiBaoLoi, noiDung) {
    noiBaoLoi.textContent = noiDung;

    const khungNhap = truongNhap.closest(".o-nhap");

    if (khungNhap) {
        khungNhap.classList.add("co-loi");
    }
}

oEmail.addEventListener("input", function () {
    xoaLoi(oEmail, loiEmail);
    anThongBao();
});

oMatKhau.addEventListener("input", function () {
    xoaLoi(oMatKhau, loiMatKhau);
    anThongBao();
});

// XỬ LÝ ĐĂNG NHẬP
formDangNhap.addEventListener("submit", function (event) {
    event.preventDefault();

    xoaLoi(oEmail, loiEmail);
    xoaLoi(oMatKhau, loiMatKhau);
    anThongBao();

    const email = oEmail.value.trim().toLowerCase();
    const matKhau = oMatKhau.value;

    let hopLe = true;

    if (email === "") {
        hienLoi(oEmail, loiEmail, "Bạn vui lòng nhập địa chỉ email.");
        hopLe = false;
    } else {
        const dinhDangEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!dinhDangEmail.test(email)) {
            hienLoi(oEmail, loiEmail, "Địa chỉ email chưa đúng định dạng.");
            hopLe = false;
        }
    }

    if (matKhau.trim() === "") {
        hienLoi(oMatKhau, loiMatKhau, "Bạn vui lòng nhập mật khẩu.");
        hopLe = false;
    }

    if (!hopLe) {
        return;
    }

    try {
        const duLieuNguoiDung = localStorage.getItem("danhSachNguoiDung");
        const danhSachNguoiDung = duLieuNguoiDung
            ? JSON.parse(duLieuNguoiDung)
            : [];

        if (!Array.isArray(danhSachNguoiDung)) {
            hienThongBao(
                "Dữ liệu tài khoản không hợp lệ. Bạn hãy kiểm tra lại trang đăng ký.",
                "loi"
            );
            return;
        }

        const nguoiDung = danhSachNguoiDung.find(function (user) {
            return (
                typeof user.email === "string" &&
                user.email.trim().toLowerCase() === email &&
                typeof user.matKhau === "string" &&
                user.matKhau === matKhau
            );
        });

        if (!nguoiDung) {
            hienThongBao(
                "Email hoặc mật khẩu chưa chính xác. Bạn hãy kiểm tra và thử lại nhé.",
                "loi"
            );
            return;
        }

        const phienDangNhap = {
            id: nguoiDung.id,
            hoTen: nguoiDung.hoTen || "",
            email: nguoiDung.email,
            thoiGianDangNhap: new Date().toISOString()
        };

        localStorage.setItem(
            "nguoiDungHienTai",
            JSON.stringify(phienDangNhap)
        );

        hienThongBao("Đăng nhập thành công! Đang chuyển trang...", "thanh-cong");

        nutDangNhap.disabled = true;
        nutDangNhap.textContent = "Đang chuyển trang...";

        window.location.href = "../trang-chu/trang-chu.html";

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);

        hienThongBao(
            "Không thể xử lý đăng nhập. Bạn hãy tải lại trang và thử lại.",
            "loi"
        );
    }
});
