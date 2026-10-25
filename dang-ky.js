
document.addEventListener("DOMContentLoaded", function () {
    const KHOA_NGUOI_DUNG = "danhSachNguoiDung";

    const form = document.getElementById("formDangKy");
    const hoTen = document.getElementById("hoTen");
    const email = document.getElementById("email");
    const matKhau = document.getElementById("matKhau");
    const xacNhanMatKhau = document.getElementById("xacNhanMatKhau");
    const thongBao = document.getElementById("thongBao");
    const nutDangKy = form.querySelector('[type="submit"]');
    const goiYEmail = document.getElementById("goiYEmail");
    const nutSuaEmail = document.getElementById("nutSuaEmail");

    const cacTenMien = [
        "gmail.com",
        "outlook.com",
        "hotmail.com",
        "yahoo.com",
        "icloud.com"
    ];

    const tenMienSai = {
        "gnail.com": "gmail.com",
        "gmial.com": "gmail.com",
        "gmai.com": "gmail.com",
        "gamil.com": "gmail.com",
        "gmal.com": "gmail.com",
        "gmail.con": "gmail.com",
        "gmail.co": "gmail.com",
        "gmail.cm": "gmail.com",
        "gmai.con": "gmail.com",
        "outllok.com": "outlook.com",
        "outlok.com": "outlook.com",
        "hotmal.com": "hotmail.com",
        "yaho.com": "yahoo.com"
    };

    function hienLoi(truong, idLoi, noiDung) {
        document.getElementById(idLoi).textContent = noiDung;
        truong.setAttribute("aria-invalid", noiDung ? "true" : "false");
    }

    function xoaLoi() {
        hienLoi(hoTen, "loiHoTen", "");
        hienLoi(email, "loiEmail", "");
        hienLoi(matKhau, "loiMatKhau", "");
        hienLoi(xacNhanMatKhau, "loiXacNhan", "");
    }

    function hienThongBao(noiDung, laLoi = false) {
        thongBao.textContent = noiDung;
        thongBao.hidden = false;
        thongBao.classList.toggle("loi-chung", laLoi);
    }

    function anThongBao() {
        thongBao.textContent = "";
        thongBao.hidden = true;
        thongBao.classList.remove("loi-chung");
    }

    function layDanhSachNguoiDung() {
        const duLieu = localStorage.getItem(KHOA_NGUOI_DUNG);

        if (duLieu === null) return [];

        const danhSach = JSON.parse(duLieu);

        if (!Array.isArray(danhSach)) {
            throw new Error("Dữ liệu tài khoản không hợp lệ.");
        }

        return danhSach;
    }

    // Tính số thao tác cần thiết để biến chuỗi A thành chuỗi B.
    function khoangCachChuoi(a, b) {
        const bang = Array.from(
            { length: a.length + 1 },
            () => Array(b.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) bang[i][0] = i;
        for (let j = 0; j <= b.length; j++) bang[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const chiPhi = a[i - 1] === b[j - 1] ? 0 : 1;

                bang[i][j] = Math.min(
                    bang[i - 1][j] + 1,
                    bang[i][j - 1] + 1,
                    bang[i - 1][j - 1] + chiPhi
                );
            }
        }

        return bang[a.length][b.length];
    }

    function timGoiYEmail(giaTri) {
        const emailNhap = giaTri.trim().toLowerCase();
        const viTriA = emailNhap.lastIndexOf("@");

        if (viTriA <= 0 || viTriA === emailNhap.length - 1) {
            return "";
        }

        const tenNguoiDung = emailNhap.slice(0, viTriA);
        const tenMien = emailNhap.slice(viTriA + 1);

        if (tenMienSai[tenMien]) {
            return tenNguoiDung + "@" + tenMienSai[tenMien];
        }

        for (const mienDung of cacTenMien) {
            if (
                tenMien !== mienDung &&
                khoangCachChuoi(tenMien, mienDung) === 1
            ) {
                return tenNguoiDung + "@" + mienDung;
            }
        }

        return "";
    }

    function capNhatGoiYEmail() {
        const goiY = timGoiYEmail(email.value);

        if (goiY) {
            nutSuaEmail.textContent = goiY;
            goiYEmail.hidden = false;
        } else {
            goiYEmail.hidden = true;
        }
    }

    email.addEventListener("input", capNhatGoiYEmail);

    nutSuaEmail.addEventListener("click", function () {
        email.value = nutSuaEmail.textContent;
        goiYEmail.hidden = true;
        email.focus();
        email.dispatchEvent(new Event("input", { bubbles: true }));
    });

    form.addEventListener("submit", function (suKien) {
        suKien.preventDefault();
        xoaLoi();
        anThongBao();

        const ten = hoTen.value.trim();
        const emailNhap = email.value.trim().toLowerCase();
        const matKhauNhap = matKhau.value;
        const xacNhan = xacNhanMatKhau.value;
        let hopLe = true;

        if (ten.length < 2) {
            hienLoi(hoTen, "loiHoTen", "Vui lòng nhập họ tên hợp lệ.");
            hopLe = false;
        }

        const mauEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!mauEmail.test(emailNhap)) {
            hienLoi(email, "loiEmail", "Vui lòng nhập email đúng định dạng.");
            hopLe = false;
        }

        const goiY = timGoiYEmail(emailNhap);

        if (goiY) {
            nutSuaEmail.textContent = goiY;
            goiYEmail.hidden = false;
            hienLoi(email, "loiEmail", "Có thể bạn đã gõ sai tên miền email.");
            hopLe = false;
        }

        if (
            matKhauNhap.length < 8 ||
            !/[A-Z]/.test(matKhauNhap) ||
            !/[a-z]/.test(matKhauNhap) ||
            !/[0-9]/.test(matKhauNhap)
        ) {
            hienLoi(
                matKhau,
                "loiMatKhau",
                "Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và chữ số."
            );
            hopLe = false;
        }

        if (!xacNhan || xacNhan !== matKhauNhap) {
            hienLoi(
                xacNhanMatKhau,
                "loiXacNhan",
                "Mật khẩu xác nhận không khớp."
            );
            hopLe = false;
        }

        if (!hopLe) {
            const truongLoi = form.querySelector('[aria-invalid="true"]');
            if (truongLoi) truongLoi.focus();
            return;
        }

        let danhSach;

        try {
            danhSach = layDanhSachNguoiDung();
        } catch (loi) {
            console.error(loi);
            hienThongBao("Không thể đọc dữ liệu tài khoản. Hãy thử tải lại trang.", true);
            return;
        }

        const daTonTai = danhSach.some(function (nguoiDung) {
            return (
                typeof nguoiDung.email === "string" &&
                nguoiDung.email.trim().toLowerCase() === emailNhap
            );
        });

        if (daTonTai) {
            hienLoi(email, "loiEmail", "Email này đã được đăng ký.");
            email.focus();
            return;
        }

        const nguoiDungMoi = {
            id: Date.now(),
            hoTen: ten,
            email: emailNhap,
            matKhau: matKhauNhap
        };

        try {
            danhSach.push(nguoiDungMoi);

            localStorage.setItem(
                KHOA_NGUOI_DUNG,
                JSON.stringify(danhSach)
            );

            nutDangKy.disabled = true;
            nutDangKy.textContent = "Đăng ký thành công";

            hienThongBao("Tạo tài khoản thành công! Đang chuyển sang đăng nhập.");

            setTimeout(function () {
                window.location.href = "../dang-nhap/dang-nhap.html";
            }, 1000);
        } catch (loi) {
            console.error(loi);
            hienThongBao("Không thể lưu tài khoản. Vui lòng thử lại.", true);
        }
    });

    document.querySelectorAll(".nut-hien-mat-khau").forEach(function (nut) {
        nut.addEventListener("click", function () {
            const truong = document.getElementById(nut.dataset.target);
            const dangHien = truong.type === "text";

            truong.type = dangHien ? "password" : "text";
            nut.textContent = dangHien ? "Hiện" : "Ẩn";
            nut.setAttribute("aria-pressed", String(!dangHien));
        });
    });

    [hoTen, email, matKhau, xacNhanMatKhau].forEach(function (truong) {
        truong.addEventListener("input", function () {
            anThongBao();

            const idLoi = {
                hoTen: "loiHoTen",
                email: "loiEmail",
                matKhau: "loiMatKhau",
                xacNhanMatKhau: "loiXacNhan"
            }[truong.id];

            if (idLoi) {
                document.getElementById(idLoi).textContent = "";
                truong.setAttribute("aria-invalid", "false");
            }

            if (truong === email) capNhatGoiYEmail();
        });
    });
});
