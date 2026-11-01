
document.addEventListener("DOMContentLoaded", function () {
    const KHOA_NGUOI_DUNG = "nguoiDungHienTai";
    const KHOA_DANH_SACH_NGUOI_DUNG = "danhSachNguoiDung";
    const KHOA_SAN_PHAM = "sanPhamCaNhan";

    const formThongTin = document.getElementById("formThongTin");
    const oHoTen = document.getElementById("hoTen");
    const oEmail = document.getElementById("email");
    const thongBao = document.getElementById("thongBao");
    const danhSachTin = document.getElementById("danhSachTin");
    const soLuongTin = document.getElementById("soLuongTin");
    const nutDangXuat = document.getElementById("nutDangXuat");

    function docDuLieu(khoa, macDinh) {
        try {
            const duLieu = JSON.parse(localStorage.getItem(khoa));
            return duLieu ?? macDinh;
        } catch (loi) {
            return macDinh;
        }
    }

    let nguoiDung = docDuLieu(KHOA_NGUOI_DUNG, null);

    function hienThongBao(noiDung, loai) {
        thongBao.textContent = noiDung;
        thongBao.className = "thong-bao " + loai;
        thongBao.hidden = false;
    }

    if (!nguoiDung || !nguoiDung.email) {
        alert("Bạn cần đăng nhập để xem thông tin cá nhân.");
        window.location.href = "../dang-nhap/dang-nhap.html";
        return;
    }

    function layDanhSachTinCuaToi() {
        const tatCaTin = docDuLieu(KHOA_SAN_PHAM, []);

        if (!Array.isArray(tatCaTin)) {
            return [];
        }

        return tatCaTin.filter(function (tin) {
            if (tin.emailChuSoHuu) {
                return tin.emailChuSoHuu.toLowerCase() ===
                    nguoiDung.email.toLowerCase();
            }

            if (tin.email) {
                return tin.email.toLowerCase() ===
                    nguoiDung.email.toLowerCase();
            }

            if (tin.idNguoiDung != null && nguoiDung.id != null) {
                return String(tin.idNguoiDung) === String(nguoiDung.id);
            }

            return false;
        });
    }

    function dinhDangGia(gia) {
        const giaSo = Number(gia);

        if (!Number.isFinite(giaSo)) {
            return "Chưa có giá";
        }

        return giaSo.toLocaleString("vi-VN") + " đ";
    }

    function taoNut(noiDung, className, hanhDong) {
        const nut = document.createElement("button");
        nut.type = "button";
        nut.className = "nut-tin " + className;
        nut.textContent = noiDung;
        nut.addEventListener("click", hanhDong);
        return nut;
    }

    function hienThiTinDang() {
        const cacTin = layDanhSachTinCuaToi();

        soLuongTin.textContent = cacTin.length + " tin";
        danhSachTin.replaceChildren();

        if (cacTin.length === 0) {
            const khoiTrong = document.createElement("div");
            khoiTrong.className = "trong-rong";

            const tieuDe = document.createElement("h3");
            tieuDe.textContent = "Bạn chưa có tin đăng nào";

            const moTa = document.createElement("p");
            moTa.textContent =
                "Hãy đăng món đồ bạn không còn sử dụng để chia sẻ với mọi người.";

            const lienKet = document.createElement("a");
            lienKet.href = "../dang-do/dang-do.html";
            lienKet.textContent = "+ Đăng món đồ đầu tiên";

            khoiTrong.append(tieuDe, moTa, lienKet);
            danhSachTin.appendChild(khoiTrong);
            return;
        }

        cacTin.forEach(function (tin) {
            const theTin = document.createElement("article");
            theTin.className = "tin-dang";

            const duongDanAnh = tin.anh || tin.hinhAnh || "";

            if (duongDanAnh) {
                const anh = document.createElement("img");
                anh.className = "anh-tin";
                anh.src = duongDanAnh;
                anh.alt = tin.tenSanPham || tin.ten || "Ảnh sản phẩm";

                anh.onerror = function () {
                    const anhTrong = document.createElement("div");
                    anhTrong.className = "anh-tin anh-trong";
                    anhTrong.textContent = "Chưa có ảnh";
                    anh.replaceWith(anhTrong);
                };

                theTin.appendChild(anh);
            } else {
                const anhTrong = document.createElement("div");
                anhTrong.className = "anh-tin anh-trong";
                anhTrong.textContent = "Chưa có ảnh";
                theTin.appendChild(anhTrong);
            }

            const thongTin = document.createElement("div");
            thongTin.className = "thong-tin-tin";

            const ten = document.createElement("h3");
            ten.textContent = tin.tenSanPham || tin.ten || "Sản phẩm chưa có tên";

            const gia = document.createElement("p");
            gia.className = "gia-tin";
            gia.textContent = dinhDangGia(tin.gia);

            const chiTiet = document.createElement("div");
            chiTiet.className = "chi-tiet-tin";

            const danhMuc = document.createElement("span");
            danhMuc.textContent = tin.danhMuc || "Chưa phân loại";

            const tinhTrang = document.createElement("span");
            tinhTrang.textContent = tin.tinhTrang || "Chưa cập nhật";

            chiTiet.append(danhMuc, tinhTrang);

            const trangThai = document.createElement("span");
            trangThai.className = "trang-thai-tin";
            trangThai.textContent = tin.trangThai || "Đã đăng";

            thongTin.append(ten, gia, chiTiet, trangThai);

            if (tin.moTa) {
                const moTa = document.createElement("p");
                moTa.textContent = tin.moTa;
                moTa.style.color = "#7b867e";
                moTa.style.fontSize = "12px";
                moTa.style.marginTop = "10px";
                thongTin.appendChild(moTa);
            }

            const hanhDong = document.createElement("div");
            hanhDong.className = "hanh-dong-tin";

            const nutSua = taoNut("Chỉnh sửa", "", function () {
                if (tin.id == null) {
                    alert("Tin đăng này chưa có ID nên chưa thể chỉnh sửa.");
                    return;
                }

                window.location.href =
                    "../dang-do/dang-do.html?sua=" +
                    encodeURIComponent(String(tin.id));
            });

            const nutXoa = taoNut("Xóa tin", "nut-xoa", function () {
                const dongY = confirm(
                    'Bạn có chắc muốn xóa tin "' +
                    (tin.tenSanPham || tin.ten || "này") + '" không?'
                );

                if (!dongY) return;

                const tatCaTin = docDuLieu(KHOA_SAN_PHAM, []);

                const tinCanXoa = tatCaTin.find(function (muc) {
                    return String(muc.id) === String(tin.id);
                });

                if (!tinCanXoa) {
                    alert("Không tìm thấy tin đăng cần xóa.");
                    return;
                }

                const dungChuSoHuu =
                    (tinCanXoa.emailChuSoHuu &&
                        tinCanXoa.emailChuSoHuu.toLowerCase() ===
                        nguoiDung.email.toLowerCase()) ||
                    (tinCanXoa.email &&
                        tinCanXoa.email.toLowerCase() ===
                        nguoiDung.email.toLowerCase()) ||
                    (tinCanXoa.idNguoiDung != null &&
                        nguoiDung.id != null &&
                        String(tinCanXoa.idNguoiDung) ===
                        String(nguoiDung.id));

                if (!dungChuSoHuu) {
                    alert("Không thể xác nhận chủ sở hữu tin đăng này.");
                    return;
                }

                const danhSachMoi = tatCaTin.filter(function (muc) {
                    return String(muc.id) !== String(tin.id);
                });

                localStorage.setItem(
                    KHOA_SAN_PHAM,
                    JSON.stringify(danhSachMoi)
                );

                hienThiTinDang();
                hienThongBao("Đã xóa tin đăng.", "thanh-cong");
            });

            hanhDong.append(nutSua, nutXoa);
            theTin.append(thongTin, hanhDong);
            danhSachTin.appendChild(theTin);
        });
    }

    function capNhatNguoiDung() {
        const danhSachNguoiDung =
            docDuLieu(KHOA_DANH_SACH_NGUOI_DUNG, []);

        const tenMoi = oHoTen.value.trim();

        if (!tenMoi) {
            hienThongBao("Vui lòng nhập họ và tên.", "loi");
            return;
        }

        const taiKhoan = danhSachNguoiDung.find(function (nguoi) {
            return nguoi.email &&
                nguoi.email.toLowerCase() === nguoiDung.email.toLowerCase();
        });

        if (!taiKhoan) {
            hienThongBao(
                "Không tìm thấy tài khoản trong danh sách người dùng.",
                "loi"
            );
            return;
        }

        taiKhoan.hoTen = tenMoi;
        nguoiDung.hoTen = tenMoi;

        localStorage.setItem(
            KHOA_DANH_SACH_NGUOI_DUNG,
            JSON.stringify(danhSachNguoiDung)
        );

        localStorage.setItem(
            KHOA_NGUOI_DUNG,
            JSON.stringify(nguoiDung)
        );

        hienThongBao("Đã lưu thông tin cá nhân.", "thanh-cong");
    }

    oHoTen.value = nguoiDung.hoTen || "";
    oEmail.value = nguoiDung.email || "";

    formThongTin.addEventListener("submit", function (suKien) {
        suKien.preventDefault();
        capNhatNguoiDung();
    });

    nutDangXuat.addEventListener("click", function () {
    const dongY = confirm("Bạn có chắc muốn đăng xuất không?");
    
    if (!dongY) {
        return;
    }

    // Xóa thông tin đăng nhập hiện tại
    localStorage.removeItem("nguoiDungHienTai");

    // Chuyển về trang đăng nhập
    window.location.replace("../dang-nhap/dang-nhap.html");
    });
});


/* =========================
   BACK TO TOP
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const backToTop = document.getElementById("backToTop");

    if (!backToTop) return;

    // Hiện nút khi cuộn xuống
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    // Cuộn mượt về đầu trang
    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});
