
document.addEventListener("DOMContentLoaded", function () {
    const danhSachSanPham = document.getElementById("danhSachSanPham");
    const nutTaiKhoan = document.getElementById("nutTaiKhoan");

    // Kiểm tra tài khoản đăng nhập
    let nguoiDung = null;

    try {
        nguoiDung = JSON.parse(
            localStorage.getItem("nguoiDungHienTai")
        );
    } catch (loi) {
        nguoiDung = null;
    }

    if (nguoiDung && nguoiDung.email) {
        nutTaiKhoan.textContent = "Tài khoản";
        nutTaiKhoan.href =
            "../thong-tin-ca-nhan/thong-tin.html";
    }

    // Lấy sản phẩm đã đăng
    let sanPham = [];

    try {
        sanPham = JSON.parse(
            localStorage.getItem("sanPhamCaNhan")
        ) || [];
    } catch (loi) {
        sanPham = [];
    }

    // Chỉ hiển thị tối đa 4 sản phẩm mới
    sanPham = sanPham
        .filter(function (sp) {
            return sp.trangThai !== "Đã xóa";
        })
        .reverse()
        .slice(0, 4);

    if (sanPham.length === 0) {
        danhSachSanPham.innerHTML = `
            <div class="trong-rong">
                Chưa có sản phẩm nào.
                <a href="../dang-do/dang-do.html">
                    Hãy đăng món đồ đầu tiên nhé!
                </a>
            </div>
        `;
        return;
    }

    sanPham.forEach(function (sp) {
        const the = document.createElement("article");
        the.className = "the-san-pham";

        const anh = document.createElement("img");
        anh.className = "anh-san-pham";
        anh.alt = sp.tenSanPham || sp.ten || "Sản phẩm";

        const duongDanAnh = sp.anh || sp.hinhAnh;

        if (duongDanAnh) {
            anh.src = duongDanAnh;
        } else {
            anh.style.display = "none";
        }

        anh.onerror = function () {
            anh.style.display = "none";
        };

        const ten = document.createElement("h3");
        ten.className = "ten-san-pham";
        ten.textContent = sp.tenSanPham || sp.ten || "Sản phẩm";

        const gia = document.createElement("p");
        gia.className = "gia-san-pham";

        const giaSo = Number(sp.gia);

        gia.textContent =
            sp.gia !== "" && sp.gia != null && Number.isFinite(giaSo)
                ? giaSo.toLocaleString("vi-VN") + " đ"
                : "Liên hệ";

        the.appendChild(anh);
        the.appendChild(ten);
        the.appendChild(gia);

        danhSachSanPham.appendChild(the);
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
