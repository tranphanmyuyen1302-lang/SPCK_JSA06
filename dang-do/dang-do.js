document.addEventListener("DOMContentLoaded", function () {
    const KHOA_DANG_NHAP = "nguoiDungHienTai";
    const KHOA_TIN_DANG = "sanPhamCaNhan";

    const form = document.getElementById("formDangDo");
    const oTen = document.getElementById("tenSanPham");
    const oDanhMuc = document.getElementById("danhMuc");
    const oGia = document.getElementById("giaSanPham");
    const oTinhTrang = document.getElementById("tinhTrang");
    const oMoTa = document.getElementById("moTa");
    const oAnh = document.getElementById("anhSanPham");

    const oThongBao = document.getElementById("thongBao");
    const oXemTruocAnh = document.getElementById("xemTruocAnh");
    const oAnhXemTruoc = document.getElementById("anhXemTruoc");
    const nutXoaAnh = document.getElementById("nutXoaAnh");

    const oAnhMacDinh = document.getElementById("anhXemTruocMacDinh");
    const oAnhThe = document.getElementById("anhTheXemTruoc");

    let anhDangChon = null;
    let duongDanAnh = "";

    function docDuLieu(khoa, macDinh) {
        try {
            const duLieu = localStorage.getItem(khoa);
            return duLieu ? JSON.parse(duLieu) : macDinh;
        } catch (loi) {
            console.error("Lỗi đọc dữ liệu:", loi);
            return macDinh;
        }
    }

    function hienThongBao(noiDung, thanhCong = false) {
        oThongBao.textContent = noiDung;
        oThongBao.classList.toggle("thanh-cong", thanhCong);
    }

    function dinhDangGia(gia) {
        return Number(gia || 0).toLocaleString("vi-VN") + " ₫";
    }

    function tenDanhMuc(danhMuc) {
        const danhSach = {
            books: "Sách",
            clothing: "Quần áo",
            smartphones: "Điện thoại",
            laptops: "Máy tính",
            furniture: "Nội thất",
            accessories: "Phụ kiện",
            other: "Khác"
        };

        return danhSach[danhMuc] || "Danh mục";
    }

    function capNhatXemTruoc() {
        document.getElementById("xemTruocTen").textContent =
            oTen.value.trim() || "Tên sản phẩm của bạn";

        document.getElementById("xemTruocDanhMuc").textContent =
            tenDanhMuc(oDanhMuc.value);

        document.getElementById("xemTruocGia").textContent =
            oGia.value !== "" && Number(oGia.value) >= 0
                ? dinhDangGia(oGia.value)
                : "0 ₫";

        document.getElementById("nhanTinhTrang").textContent =
            oTinhTrang.value || "Tình trạng sản phẩm";

        document.getElementById("xemTruocMoTa").textContent =
            oMoTa.value.trim() ||
            "Mô tả sản phẩm sẽ hiển thị tại đây.";

        if (duongDanAnh) {
            oAnhMacDinh.hidden = true;
            oAnhThe.hidden = false;
            oAnhThe.src = duongDanAnh;
        } else {
            oAnhMacDinh.hidden = false;
            oAnhThe.hidden = true;
            oAnhThe.removeAttribute("src");
        }
    }

    [oTen, oDanhMuc, oGia, oTinhTrang, oMoTa].forEach(function (o) {
        o.addEventListener("input", capNhatXemTruoc);
        o.addEventListener("change", capNhatXemTruoc);
    });

    oAnh.addEventListener("change", function () {
        hienThongBao("");

        const tep = oAnh.files[0];

        if (!tep) {
            return;
        }

        const dinhDangHopLe = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!dinhDangHopLe.includes(tep.type)) {
            oAnh.value = "";
            anhDangChon = null;
            duongDanAnh = "";
            oXemTruocAnh.hidden = true;
            hienThongBao("Vui lòng chọn ảnh JPG, PNG hoặc WEBP.");
            capNhatXemTruoc();
            return;
        }

        if (tep.size > 3 * 1024 * 1024) {
            oAnh.value = "";
            anhDangChon = null;
            duongDanAnh = "";
            oXemTruocAnh.hidden = true;
            hienThongBao("Ảnh vượt quá 3 MB. Hãy chọn ảnh nhỏ hơn nhé.");
            capNhatXemTruoc();
            return;
        }

        anhDangChon = tep;

        const docAnh = new FileReader();

        docAnh.onload = function () {
            duongDanAnh = docAnh.result;
            oAnhXemTruoc.src = duongDanAnh;
            oXemTruocAnh.hidden = false;
            capNhatXemTruoc();
        };

        docAnh.onerror = function () {
            anhDangChon = null;
            duongDanAnh = "";
            hienThongBao("Không thể đọc ảnh này. Bạn hãy thử ảnh khác.");
        };

        docAnh.readAsDataURL(tep);
    });

    nutXoaAnh.addEventListener("click", function () {
        oAnh.value = "";
        anhDangChon = null;
        duongDanAnh = "";
        oXemTruocAnh.hidden = true;
        oAnhXemTruoc.removeAttribute("src");
        hienThongBao("");
        capNhatXemTruoc();
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        hienThongBao("");

        const nguoiDung = docDuLieu(KHOA_DANG_NHAP, null);

        if (!nguoiDung || !nguoiDung.email) {
            hienThongBao(
                "Bạn cần đăng nhập trước khi đăng tin. Đang chuyển đến trang đăng nhập..."
            );

            setTimeout(function () {
                window.location.href =
                    "../dang-nhap/dang-nhap.html";
            }, 1200);

            return;
        }

        const ten = oTen.value.trim();
        const danhMuc = oDanhMuc.value;
        const gia = Number(oGia.value);
        const tinhTrang = oTinhTrang.value;
        const moTa = oMoTa.value.trim();

        if (ten.length < 3) {
            hienThongBao("Tên sản phẩm cần có ít nhất 3 ký tự.");
            oTen.focus();
            return;
        }

        if (!danhMuc || !tinhTrang) {
            hienThongBao("Bạn hãy chọn danh mục và tình trạng sản phẩm.");
            return;
        }

        if (
            oGia.value.trim() === "" ||
            !Number.isFinite(gia) ||
            gia < 0 ||
            gia > 100000000000
        ) {
            hienThongBao("Vui lòng nhập mức giá hợp lệ.");
            oGia.focus();
            return;
        }

        if (moTa.length < 10) {
            hienThongBao("Mô tả cần có ít nhất 10 ký tự.");
            oMoTa.focus();
            return;
        }

        if (!anhDangChon || !duongDanAnh) {
            hienThongBao("Bạn hãy chọn ảnh sản phẩm trước khi đăng.");
            oAnh.focus();
            return;
        }

        let danhSach = docDuLieu(KHOA_TIN_DANG, []);

        if (!Array.isArray(danhSach)) {
            danhSach = [];
        }

        const tinMoi = {
            id: "tin-" + Date.now(),
            ten: ten,
            tenSanPham: ten,
            danhMuc: danhMuc,
            gia: gia,
            tinhTrang: tinhTrang,
            moTa: moTa,
            anh: duongDanAnh,
            hinhAnh: duongDanAnh,
            emailChuSoHuu: String(nguoiDung.email).toLowerCase(),
            tenChuSoHuu: nguoiDung.hoTen || "Thành viên PassIt",
            ngayDang: new Date().toISOString(),
            trangThai: "Đang hiển thị"
        };

        danhSach.unshift(tinMoi);

        try {
            localStorage.setItem(KHOA_TIN_DANG, JSON.stringify(danhSach));
        } catch (loi) {
            console.error("Không lưu được tin đăng:", loi);
            hienThongBao(
                "Không thể lưu tin đăng. Có thể ảnh quá lớn hoặc bộ nhớ trình duyệt đã đầy."
            );
            return;
        }

        hienThongBao("Đăng tin thành công! Đang mở danh sách tin đăng...", true);

        form.reset();
        anhDangChon = null;
        duongDanAnh = "";
        oXemTruocAnh.hidden = true;
        oAnhXemTruoc.removeAttribute("src");
        capNhatXemTruoc();

        setTimeout(function () {
            window.location.href =
                "../danh-sach/danh-sach.html#tinDangCuaToi";
        }, 900);
    });

    capNhatXemTruoc();

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
