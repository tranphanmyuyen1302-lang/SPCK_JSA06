
document.addEventListener("DOMContentLoaded", function () {
    const KHOA_YEU_THICH = "sanPhamYeuThich";

    const danhSachYeuThich =
        document.getElementById("danhSachYeuThich");
    const soLuongYeuThich =
        document.getElementById("soLuongYeuThich");
    const thongBao = document.getElementById("thongBao");

    function docYeuThich() {
        try {
            const duLieu = JSON.parse(
                localStorage.getItem(KHOA_YEU_THICH)
            );

            return Array.isArray(duLieu) ? duLieu : [];
        } catch (loi) {
            return [];
        }
    }

    function luuYeuThich(ds) {
        localStorage.setItem(KHOA_YEU_THICH, JSON.stringify(ds));
    }

    function dinhDangGia(gia) {
        if (gia === null || gia === undefined || gia === "") {
            return "Chưa có giá";
        }

        const giaSo = Number(gia);

        if (!Number.isFinite(giaSo)) {
            return String(gia);
        }

        return giaSo.toLocaleString("vi-VN") + " đ";
    }

    function hienThongBao(noiDung) {
        thongBao.textContent = noiDung;
        thongBao.hidden = false;

        setTimeout(function () {
            thongBao.hidden = true;
        }, 2500);
    }

    function hienTrangTrong() {
        const khoiTrong = document.createElement("div");
        khoiTrong.className = "trang-trong";

        const tieuDe = document.createElement("h2");
        tieuDe.textContent = "Bạn chưa có sản phẩm yêu thích";

        const moTa = document.createElement("p");
        moTa.textContent =
            "Khám phá danh sách và nhấn biểu tượng trái tim để lưu những món đồ bạn thích.";

        const lienKet = document.createElement("a");
        lienKet.href = "../danh-sach/danh-sach.html";
        lienKet.textContent = "Khám phá sản phẩm";

        khoiTrong.append(tieuDe, moTa, lienKet);
        danhSachYeuThich.appendChild(khoiTrong);
    }

    function hienThiSanPham() {
        const ds = docYeuThich();

        soLuongYeuThich.textContent = ds.length + " sản phẩm";
        danhSachYeuThich.replaceChildren();

        if (ds.length === 0) {
            hienTrangTrong();
            return;
        }

        ds.forEach(function (sanPham, viTri) {
            const the = document.createElement("article");
            the.className = "the-san-pham";

            const khungAnh = document.createElement("div");
            khungAnh.className = "khung-anh";

            const duongDanAnh = sanPham.anh || sanPham.hinhAnh || "";

            if (duongDanAnh) {
                const anh = document.createElement("img");
                anh.className = "anh-san-pham";
                anh.src = duongDanAnh;
                anh.alt = sanPham.ten || sanPham.tenSanPham || "Sản phẩm";

                anh.onerror = function () {
                    const anhTrong = document.createElement("div");
                    anhTrong.className = "anh-trong";
                    anhTrong.textContent = "Không có ảnh";
                    anh.replaceWith(anhTrong);
                };

                khungAnh.appendChild(anh);
            } else {
                const anhTrong = document.createElement("div");
                anhTrong.className = "anh-trong";
                anhTrong.textContent = "Chưa có ảnh";
                khungAnh.appendChild(anhTrong);
            }

            const nutBo = document.createElement("button");
            nutBo.type = "button";
            nutBo.className = "nut-bo-yeu-thich";
            nutBo.textContent = "♥";
            nutBo.title = "Bỏ yêu thích";
            nutBo.setAttribute("aria-label", "Bỏ yêu thích");

            nutBo.addEventListener("click", function () {
                const dsMoi = docYeuThich();

                // Xóa đúng mục được chọn trong danh sách đã lưu.
                dsMoi.splice(viTri, 1);
                luuYeuThich(dsMoi);

                hienThiSanPham();
                hienThongBao("Đã bỏ sản phẩm khỏi danh sách yêu thích.");
            });

            khungAnh.appendChild(nutBo);

            const thongTin = document.createElement("div");
            thongTin.className = "thong-tin-san-pham";

            const ten = document.createElement("h2");
            ten.className = "ten-san-pham";
            ten.textContent =
                sanPham.ten || sanPham.tenSanPham || "Sản phẩm chưa có tên";

            const gia = document.createElement("p");
            gia.className = "gia-san-pham";
            gia.textContent = dinhDangGia(sanPham.gia);

            const moTa = document.createElement("p");
            moTa.className = "mo-ta-ngan";
            moTa.textContent = sanPham.danhMuc || "Sản phẩm đã lưu";

            const nutChiTiet = document.createElement("a");
            nutChiTiet.className = "nut-chi-tiet";
            nutChiTiet.href = "../danh-sach/danh-sach.html";
            nutChiTiet.textContent = "Xem danh sách sản phẩm";

            thongTin.append(ten, gia, moTa, nutChiTiet);
            the.append(khungAnh, thongTin);
            danhSachYeuThich.appendChild(the);
        });
    }

    hienThiSanPham();

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
