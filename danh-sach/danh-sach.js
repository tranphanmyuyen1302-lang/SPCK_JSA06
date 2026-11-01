
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    // 1. CẤU HÌNH
    const API_URL = "https://dummyjson.com/products?limit=100";

    const $ = (selector) => document.querySelector(selector);

    const danhSachSanPhamEl = $("#danhSachSanPham");
    const danhSachCuaToiEl = $("#danhSachTinCuaToi");
    const danhSachYeuThichEl = $("#luoiYeuThich");
    const thongBaoEl = $("#thongBaoSanPham");
    const soLuongEl = $("#soLuongSanPham");

    const formTimKiem = $("#formTimKiem");
    const tuKhoaEl = $("#tuKhoa");
    const danhMucEl = $("#locDanhMuc");
    const tinhTrangEl = $("#locTinhTrang");
    const sapXepEl = $("#sapXep");
    const nutDatLai = $("#nutXoaBoLoc");

    let sanPhamAPI = [];
    let sanPhamCaNhan = [];
    let sanPhamYeuThich = [];
    let dangTai = true;
    let loiAPI = false;


    // 2. ĐỌC VÀ LƯU LOCAL STORAGE
    function docLocalStorage(khoa, macDinh) {
        try {
            const duLieu = localStorage.getItem(khoa);

            if (duLieu === null) {
                return macDinh;
            }

            return JSON.parse(duLieu);
        } catch (loi) {
            console.error("Không đọc được " + khoa + ":", loi);
            return macDinh;
        }
    }

    function luuLocalStorage(khoa, duLieu) {
        try {
            localStorage.setItem(khoa, JSON.stringify(duLieu));
            return true;
        } catch (loi) {
            console.error("Không lưu được " + khoa + ":", loi);
            alert("Không thể lưu dữ liệu. Hãy kiểm tra bộ nhớ trình duyệt.");
            return false;
        }
    }

    function docDanhSachCaNhan() {
        const duLieu = docLocalStorage("sanPhamCaNhan", []);
        return Array.isArray(duLieu) ? duLieu : [];
    }

    function docDanhSachYeuThich() {
        const duLieu = docLocalStorage("sanPhamYeuThich", []);
        return Array.isArray(duLieu) ? duLieu : [];
    }

    function layNguoiDung() {
        const nguoiDung = docLocalStorage("nguoiDungHienTai", null);

        return nguoiDung && typeof nguoiDung === "object"
            ? nguoiDung
            : null;
    }

    function layEmailHienTai() {
        const nguoiDung = layNguoiDung();

        return nguoiDung && nguoiDung.email
            ? String(nguoiDung.email).trim().toLowerCase()
            : "";
    }

    // 3. CHUẨN HÓA DANH MỤC
    function chuanHoaDanhMuc(danhMuc) {
        const giaTri = String(danhMuc || "")
            .trim()
            .toLowerCase();

        const bangChuyenDoi = {
            "smartphones": "dien-thoai",
            "phone": "dien-thoai",
            "điện thoại": "dien-thoai",
            "dien thoai": "dien-thoai",

            "laptops": "laptop",
            "laptop": "laptop",

            "tablets": "may-tinh-bang",
            "máy tính bảng": "may-tinh-bang",

            "mens-shirts": "quan-ao",
            "womens-dresses": "quan-ao",
            "tops": "quan-ao",
            "quần áo": "quan-ao",
            "quan ao": "quan-ao",

            "mens-shoes": "giay-dep",
            "womens-shoes": "giay-dep",
            "giày dép": "giay-dep",
            "giay dep": "giay-dep",

            "womens-bags": "tui-xach",
            "túi xách": "tui-xach",
            "tui xach": "tui-xach",

            "books": "sach",
            "sách": "sach",

            "mobile-accessories": "phu-kien",
            "accessories": "phu-kien",
            "sunglasses": "phu-kien",
            "womens-jewellery": "phu-kien",
            "womens-watches": "phu-kien",
            "phụ kiện": "phu-kien",
            "phu kien": "phu-kien",

            "furniture": "noi-that",
            "home-decoration": "noi-that",
            "lighting": "noi-that",
            "nội thất": "noi-that",

            "kitchen-accessories": "gia-dung",
            "home-appliances": "gia-dung",
            "đồ gia dụng": "gia-dung",
            "gia dung": "gia-dung",

            "beauty": "lam-dep",
            "skin-care": "lam-dep",
            "fragrances": "lam-dep",
            "làm đẹp": "lam-dep",

            "sports-accessories": "the-thao",
            "thể thao": "the-thao",

            "vehicle": "khac",
            "motorcycle": "khac",
            "khác": "khac"
        };

        return bangChuyenDoi[giaTri] || giaTri || "khac";
    }

    // 4. CHUẨN HÓA DỮ LIỆU SẢN PHẨM
    function chuyenSanPhamAPI(sp) {
        return {
            id: "api-" + sp.id,
            ten: sp.title || "Sản phẩm chưa có tên",
            gia: Math.round(Number(sp.price || 0) * 25000),
            anh: sp.thumbnail || "",
            danhMuc: chuanHoaDanhMuc(sp.category),
            moTa: sp.description || "Chưa có mô tả.",
            tinhTrang: "Đã qua sử dụng",
            nguon: "api"
        };
    }

    function chuyenSanPhamCaNhan(sp) {
        return {
            ...sp,
            id: sp.id ?? ("ca-nhan-" + Math.random().toString(36).slice(2)),
            ten: sp.ten || sp.tenSanPham || "Sản phẩm chưa có tên",
            gia: Number(sp.gia || 0),
            anh: sp.anh || sp.hinhAnh || "",
            danhMuc: chuanHoaDanhMuc(sp.danhMuc),
            moTa: sp.moTa || "Chưa có mô tả.",
            tinhTrang: sp.tinhTrang || "Chưa cập nhật",
            nguon: "ca-nhan"
        };
    }

    function layTatCaSanPham() {
        return [
            ...sanPhamCaNhan.map(chuyenSanPhamCaNhan),
            ...sanPhamAPI
        ];
    }

    // 5. HÀM HIỂN THỊ THÔNG TIN
    function dinhDangGia(gia) {
        return Number(gia || 0).toLocaleString("vi-VN") + " đ";
    }

    function taoPhanTu(tag, className, noiDung) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (noiDung !== undefined) {
            element.textContent = noiDung;
        }

        return element;
    }

    function taoNutYeuThich(sp) {
        const nut = taoPhanTu("button", "nut-yeu-thich");
        nut.type = "button";

        const daThich = sanPhamYeuThich.some(
            item => String(item.id) === String(sp.id)
        );

        nut.textContent = daThich ? "♥ Đã thích" : "♡ Yêu thích";
        nut.setAttribute("aria-pressed", String(daThich));

        nut.addEventListener("click", function () {
            doiYeuThich(sp);
        });

        return nut;
    }

    function taoTheSanPham(sp) {
        const the = taoPhanTu("article", "the-san-pham");

        // Hình ảnh
        const vungAnh = taoPhanTu("div", "vung-anh-san-pham");

        const anhThayThe = taoPhanTu(
            "div",
            "anh-thay-the",
            "Chưa có hình ảnh"
        );

        if (sp.anh) {
            const anh = taoPhanTu("img", "anh-san-pham");

            anh.src = sp.anh;
            anh.alt = sp.ten;
            anh.loading = "lazy";

            anh.addEventListener("error", function () {
                anh.remove();
                if (!vungAnh.contains(anhThayThe)) {
                    vungAnh.appendChild(anhThayThe);
                }
            });

            vungAnh.appendChild(anh);
        } else {
            vungAnh.appendChild(anhThayThe);
        }

        // Nội dung
        const noiDung = taoPhanTu("div", "noi-dung-san-pham");

        const ten = taoPhanTu("h3", "ten-san-pham", sp.ten);
        const gia = taoPhanTu(
            "p",
            "gia-san-pham",
            dinhDangGia(sp.gia)
        );

        const danhMuc = taoPhanTu(
            "p",
            "danh-muc-san-pham",
            "Danh mục: " + sp.danhMuc
        );

        const tinhTrang = taoPhanTu(
            "p",
            "tinh-trang-san-pham",
            "Tình trạng: " + sp.tinhTrang
        );

        const moTa = taoPhanTu(
            "p",
            "mo-ta-san-pham",
            sp.moTa
        );

        const hanhDong = taoPhanTu("div", "hanh-dong-san-pham");
        hanhDong.appendChild(taoNutYeuThich(sp));

        noiDung.append(
            ten,
            gia,
            danhMuc,
            tinhTrang,
            moTa,
            hanhDong
        );

        the.append(vungAnh, noiDung);

        return the;
    }

    function hienThiDanhSach(khuVuc, danhSach, loiTrong) {
        if (!khuVuc) return;

        khuVuc.replaceChildren();

        if (!danhSach.length) {
            const thongBao = taoPhanTu(
                "p",
                "trang-thai",
                loiTrong
            );

            khuVuc.appendChild(thongBao);
            return;
        }

        const fragment = document.createDocumentFragment();

        danhSach.forEach(sp => {
            fragment.appendChild(taoTheSanPham(sp));
        });

        khuVuc.appendChild(fragment);
    }

    // 6. TÌM KIẾM VÀ LỌC SẢN PHẨM

    function giaTriBoLoc(element, macDinh = "all") {
        return element
            ? String(element.value || macDinh).trim().toLowerCase()
            : macDinh;
    }

    function locSanPham(danhSach) {
        const tuKhoa = giaTriBoLoc(tuKhoaEl, "").toLowerCase();
        const danhMuc = giaTriBoLoc(danhMucEl);
        const tinhTrang = giaTriBoLoc(tinhTrangEl);
        const cachSapXep = giaTriBoLoc(sapXepEl, "mac-dinh");

        let ketQua = danhSach.filter(sp => {
            const noiDungTimKiem = [
                sp.ten,
                sp.moTa,
                sp.danhMuc
            ].join(" ").toLowerCase();

            const khopTuKhoa =
                !tuKhoa || noiDungTimKiem.includes(tuKhoa);

            const danhMucSP = chuanHoaDanhMuc(sp.danhMuc);

            const khopDanhMuc =
                danhMuc === "all" || danhMucSP === danhMuc;

            const tinhTrangSP = String(sp.tinhTrang || "")
                .trim()
                .toLowerCase();

            const khopTinhTrang =
                tinhTrang === "all" ||
                tinhTrangSP === tinhTrang ||
                (tinhTrang === "tốt" && tinhTrangSP.includes("tốt"));

            return khopTuKhoa && khopDanhMuc && khopTinhTrang;
        });

        if (cachSapXep === "gia-tang") {
            ketQua.sort((a, b) => a.gia - b.gia);
        } else if (cachSapXep === "gia-giam") {
            ketQua.sort((a, b) => b.gia - a.gia);
        } else if (cachSapXep === "ten-a-z") {
            ketQua.sort((a, b) => a.ten.localeCompare(b.ten, "vi"));
        } else if (cachSapXep === "ten-z-a") {
            ketQua.sort((a, b) => b.ten.localeCompare(a.ten, "vi"));
        }

        return ketQua;
    }
    // 7. SẢN PHẨM CỦA NGƯỜI DÙNG HIỆN TẠI

    function laySanPhamCuaToi() {
        const email = layEmailHienTai();

        if (!email) return [];

        return sanPhamCaNhan
            .filter(sp => {
                const emailChu = String(
                    sp.emailChuSoHuu || sp.email || ""
                ).trim().toLowerCase();

                return emailChu === email;
            })
            .map(chuyenSanPhamCaNhan);
    }

    // 8. QUẢN LÝ SẢN PHẨM YÊU THÍCH
    function doiYeuThich(sp) {
        const daThich = sanPhamYeuThich.some(
            item => String(item.id) === String(sp.id)
        );

        if (daThich) {
            sanPhamYeuThich = sanPhamYeuThich.filter(
                item => String(item.id) !== String(sp.id)
            );
        } else {
            sanPhamYeuThich.push({
                id: sp.id,
                ten: sp.ten,
                gia: sp.gia,
                anh: sp.anh,
                danhMuc: sp.danhMuc,
                moTa: sp.moTa,
                tinhTrang: sp.tinhTrang,
                nguon: sp.nguon
            });
        }

        if (luuLocalStorage("sanPhamYeuThich", sanPhamYeuThich)) {
            capNhatGiaoDien();
        }
    }

    // 9. DỮ LIỆU DỰ PHÒNG
    function taoSanPhamDuPhong() {
        return [
            {
                id: "mau-sach",
                ten: "Sách học tập",
                gia: 35000,
                anh: "",
                danhMuc: "sach",
                moTa: "Sách học tập đã qua sử dụng, phù hợp cho học sinh.",
                tinhTrang: "Đã qua sử dụng",
                nguon: "mau"
            },
            {
                id: "mau-balo",
                ten: "Balo đi học",
                gia: 80000,
                anh: "",
                danhMuc: "phu-kien",
                moTa: "Balo dùng đi học, còn sử dụng tốt.",
                tinhTrang: "Tốt",
                nguon: "mau"
            },
            {
                id: "mau-den",
                ten: "Đèn bàn học",
                gia: 60000,
                anh: "",
                danhMuc: "gia-dung",
                moTa: "Đèn bàn dành cho góc học tập tại nhà.",
                tinhTrang: "Đã qua sử dụng",
                nguon: "mau"
            },
            {
                id: "mau-tai-nghe",
                ten: "Tai nghe",
                gia: 90000,
                anh: "",
                danhMuc: "phu-kien",
                moTa: "Tai nghe phục vụ học tập và giải trí.",
                tinhTrang: "Tốt",
                nguon: "mau"
            },
            {
                id: "mau-ao",
                ten: "Áo khoác",
                gia: 70000,
                anh: "",
                danhMuc: "quan-ao",
                moTa: "Áo khoác đã qua sử dụng, có thể tiếp tục sử dụng.",
                tinhTrang: "Tốt",
                nguon: "mau"
            },
            {
                id: "mau-dien-thoai",
                ten: "Điện thoại cũ",
                gia: 500000,
                anh: "",
                danhMuc: "dien-thoai",
                moTa: "Sản phẩm minh họa để kiểm tra chức năng lọc.",
                tinhTrang: "Đã qua sử dụng",
                nguon: "mau"
            }
        ];
    }

    // 10. CẬP NHẬT TOÀN BỘ GIAO DIỆN
    function capNhatGiaoDien() {
        const tatCaSanPham = layTatCaSanPham();
        const ketQua = locSanPham(tatCaSanPham);

        hienThiDanhSach(
            danhSachSanPhamEl,
            ketQua,
            dangTai
                ? "Đang tải sản phẩm..."
                : "Không tìm thấy sản phẩm phù hợp. Hãy thử đổi từ khóa hoặc bộ lọc."
        );

        if (soLuongEl) {
            soLuongEl.textContent = dangTai
                ? "Đang tải sản phẩm..."
                : "Tìm thấy " + ketQua.length + " sản phẩm";
        }

        if (thongBaoEl) {
            if (loiAPI) {
                thongBaoEl.textContent =
                    "Không tải được sản phẩm trực tuyến. Đang hiển thị dữ liệu dự phòng và sản phẩm bạn đã đăng.";
            } else if (dangTai) {
                thongBaoEl.textContent = "Đang tải dữ liệu sản phẩm...";
            } else {
                thongBaoEl.textContent = "";
            }
        }

        const email = layEmailHienTai();

        hienThiDanhSach(
            danhSachCuaToiEl,
            laySanPhamCuaToi(),
            email
                ? "Bạn chưa đăng sản phẩm nào."
                : "Bạn cần đăng nhập để xem sản phẩm của mình."
        );

        const danhSachYeuThichChuanHoa =
            sanPhamYeuThich.map(chuyenSanPhamCaNhan);

        hienThiDanhSach(
            danhSachYeuThichEl,
            danhSachYeuThichChuanHoa,
            "Bạn chưa có sản phẩm yêu thích nào."
        );
    }

    // 11. TẢI SẢN PHẨM TỪ API
    async function taiSanPham() {
        const controller = new AbortController();

        const henGio = setTimeout(function () {
            controller.abort();
        }, 10000);

        try {
            const response = await fetch(API_URL, {
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error("API trả về mã lỗi " + response.status);
            }

            const duLieu = await response.json();

            if (!Array.isArray(duLieu.products)) {
                throw new Error("Dữ liệu API không hợp lệ.");
            }

            sanPhamAPI = duLieu.products.map(chuyenSanPhamAPI);
            loiAPI = false;
        } catch (loi) {
            console.error("Không tải được sản phẩm từ API:", loi);

            // Chỉ dùng dữ liệu mẫu khi API thất bại.
            sanPhamAPI = taoSanPhamDuPhong();
            loiAPI = true;
        } finally {
            clearTimeout(henGio);
            dangTai = false;
            capNhatGiaoDien();
        }
    }

    // 12. GẮN SỰ KIỆN
    function ganSuKien(element, tenSuKien, hamXuLy) {
        if (element) {
            element.addEventListener(tenSuKien, hamXuLy);
        }
    }

    ganSuKien(formTimKiem, "submit", function (event) {
        event.preventDefault();
        capNhatGiaoDien();
    });

    ganSuKien(tuKhoaEl, "input", capNhatGiaoDien);
    ganSuKien(danhMucEl, "change", capNhatGiaoDien);
    ganSuKien(tinhTrangEl, "change", capNhatGiaoDien);
    ganSuKien(sapXepEl, "change", capNhatGiaoDien);

    ganSuKien(nutDatLai, "click", function () {
        if (tuKhoaEl) tuKhoaEl.value = "";
        if (danhMucEl) danhMucEl.value = "all";
        if (tinhTrangEl) tinhTrangEl.value = "all";
        if (sapXepEl) sapXepEl.value = "mac-dinh";

        capNhatGiaoDien();
    });

    // 13. KHỞI TẠO TRANG
    sanPhamCaNhan = docDanhSachCaNhan();
    sanPhamYeuThich = docDanhSachYeuThich();

    // Hiển thị dữ liệu đã lưu trước, sau đó tải API.
    capNhatGiaoDien();
    taiSanPham();

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
