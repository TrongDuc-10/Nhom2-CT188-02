// Hàm truy vấn các phần tử class cart_button
const addCartButtons = document.querySelectorAll('.cart_button');

addCartButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        // truy vấn các phần tử item
        const productItem = event.target.closest('.item');
        // truy vấn các thông tin của phần tử
        const id = productItem.querySelector('.item-id').innerText;
        const name = productItem.querySelector('.item-name').innerText;
        const price = productItem.querySelector('.item-price').innerText;
        const image = productItem.querySelector('.item-image').src;

        const product = {
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        };
        // khởi tạo giỏ hàng cart
        let cart = JSON.parse(localStorage.getItem('vellaCart')) || [];
        // Hàm kiểm tra item có trong cart chưa
        const checkItem = cart.find(function (item) {
            return item.id === product.id;
        });
        //Nếu có rồi thì tăng số lượng ngược lại sẽ thêm phần tử item mới vào
        if (checkItem) {
            checkItem.quantity += 1;
        } else {
            cart.push(product);
        }
        // thêm vào bộ nhớ của web
        localStorage.setItem('vellaCart', JSON.stringify(cart));

        alert('Đã thêm ' + name + ' vào giỏ hàng thành công!');
    });
});
//Truy vấn các class cần thiết để chuẩn bị thao tác với giỏ hàng
const cartModal = document.getElementById('cart-modal');
const btnOpenCart = document.getElementById('open-cart');
const btnCloseCart = document.querySelector('.close-cart');
const cartItemsList = document.getElementById('cart-items-list');
const totalPriceElement = document.getElementById('total-price');
// Khi ấn btnOpenCart thì sẽ hiện tab giỏ hàng lên 
btnOpenCart.addEventListener('click', function () {
    cartModal.style.display = 'block';
    hienThiGioHang();
});
// Ngược lại với btnOpenCart
btnCloseCart.addEventListener('click', function () {
    cartModal.style.display = 'none';
});

function hienThiGioHang() {

    let cart = JSON.parse(localStorage.getItem('vellaCart')) || [];
    // Reset trang giỏ hàng trước khi load item lên
    cartItemsList.innerHTML = '';
    let tongTien = 0;
    // Nếu giỏ hàng rỗng thì kêu khách mua hàng!
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align:center;">Giỏ hàng trống trơn. Hãy thêm vào giỏ hàng một thứ gì đó nhé!</p>';
        totalPriceElement.innerText = '0';
        return;
    }
    cartItemsList.addEventListener('click', function (event) {
        // Nếu chọn nút xóa khỏi giỏ
        if (event.target.classList.contains('delete-item-btn')) {
            // Truy vấn id sản phẩm
            const idCanXoa = event.target.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('vellaCart')) || [];
            // Giữ lại những item có id khác idCanXoa
            cart = cart.filter(function (item) {
                return item.id !== idCanXoa;
            });
            // Cập nhật lại hàng hóa vào bộ nhớ của web
            localStorage.setItem('vellaCart', JSON.stringify(cart));
            // Hiển thị lại giỏ hàng nếu có thay đổi, nếu không thay đổi cũng sẽ không ảnh hưởng
            hienThiGioHang();
        }
    });
    cart.forEach(function (item) {
        // xóa dấu chấm trong giá tiền hiện trên web
        let giaTienSo = parseInt(item.price.replace(/\./g, ''));
        // tính tiền đơn giản
        tongTien += giaTienSo * item.quantity; 
        // Tạo khung mẫu để hiện giá tiền của từng sản phẩm
        const div = document.createElement('div');
        div.className = 'cart-item-row';
        div.innerHTML =
            `<img src="${item.image}" alt="">
            <div style="flex-grow: 1; margin-left: 15px;">
                <p style="margin: 0; font-weight: bold; color: #333;">${item.name}</p>
                <p style="margin: 5px 0 0 0; color: #ff4d4d;">Giá: ${item.price} VNĐ</p>
            </div>
            <div style="font-weight: bold; margin-right: 15px;">SL: ${item.quantity}</div>
            
            <button class="delete-item-btn" data-id="${item.id}" style="background-color: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Xóa</button>`
            ;
        // Lần lượt từng sản phẩm trong cartItemsList vào mẫu của div
        cartItemsList.appendChild(div);
    });
    // Để giá tổng tiền trở lại số phân cách hàng nghìn x.xxx.xxx
    totalPriceElement.innerText = tongTien.toLocaleString('vi-VN');
}
// Truy vấn buy_button
const buyButtons = document.querySelectorAll('.buy_button');

buyButtons.forEach(function (btnBuy) {
    btnBuy.addEventListener('click', function (event) {
        event.preventDefault();
        // truy vấn item và thông tin của nó
        const productItem = event.target.closest('.item');
        const name = productItem.querySelector('.item-name').innerText;
        const price = productItem.querySelector('.item-price').innerText;
        // Thông báo
        alert('Đặt hàng thành công! Đang tiến hành xuất hóa đơn...');
        // Mở hộp thoại window để viết hóa đơn vào
        const invoiceWindow = window.open('', '_blank', 'width=700,height=700');
        // Gọi ngày và chuyển đổi dạng dd/mm/yyyy
        const today = new Date();
        const dateString = today.toLocaleDateString('vi-VN');
        // HTML + CSS của hóa đơn, Gemini chỉ em cách này rồi em tự thiết kế hóa đơn.
        const invoiceHTML =
            `<html>
            <head>
                <title>Hóa Đơn - Nội thất Vella</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
                    .invoice-box { max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; margin-bottom: 20px; }
                    .header h1 { color: #2c3e50; margin: 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
                    .total { font-size: 22px; font-weight: bold; color: #e74c3c; text-align: right; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #7f8c8d; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <div class="header">
                        <h1>NỘI THẤT VELLA</h1>
                        <p>Số 02 Nguyễn Văn Cừ, P. Ninh Kiều, TP Cần Thơ</p>
                        <p>Điện thoại: 1900686868</p>
                    </div>
                    
                    <h2 style="text-align: center;">HÓA ĐƠN BÁN HÀNG</h2>
                    <p><strong>Ngày xuất:</strong> ${dateString}</p>
                    <p><strong>Khách hàng:</strong> Khách vãng lai</p>
                    
                    <table>
                        <tr style="background-color: #f8f9fa;">
                            <th>Tên sản phẩm</th>
                            <th style="text-align: right;">Thành tiền</th>
                        </tr>
                        <tr>
                            <td>${name}</td>
                            <td style="text-align: right;">${price} VNĐ</td>
                        </tr>
                    </table>
                    
                    <div class="total">
                        Tổng thanh toán: ${price} VNĐ
                    </div>
                    
                    <div class="footer">
                        Cảm ơn quý khách đã tin tưởng và mua sắm tại Vella!<br>
                        (Vui lòng giữ lại hóa đơn để đối chiếu bảo hành)
                    </div>
                </div>

                <script>
                    window.onload = function() { 
                        window.print(); 
                    }
                </script>
            </body>
            </html>`
            ;

        invoiceWindow.document.write(invoiceHTML);
        invoiceWindow.document.close();
    });
});
// Truy vấn nút thanh toán ở trong giỏ hàng
const btnCheckout = document.querySelector('.checkout-btn');
btnCheckout.addEventListener('click', function () {
    let cart = JSON.parse(localStorage.getItem('vellaCart')) || [];
    // Giỏ hàng trống thì kêu mua
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống. Hãy chọn mua sản phẩm trước nhé!');
        return;
    }
    // Do có thể có nhiều dòng sản phẩm nên phải làm danh sách sản phẩm
    let danhSachSanPhamHTML = '';
    let tongTienToanBo = 0;

    cart.forEach(function (item) {
        // Xóa kí tự . và tính tiền
        let giaTienSo = parseInt(item.price.replace(/\./g, ''));
        let thanhTienItem = giaTienSo * item.quantity;
        tongTienToanBo += thanhTienItem;
        // Chuyển đổi lại dạng x.xxx.xxx
        let thanhTienDep = thanhTienItem.toLocaleString('vi-VN');
        // Mỗi lần gọi một sản phẩm sẽ cộng 1 dòng mới vào danhSachSanPhamHTML
        danhSachSanPhamHTML +=
            `<tr>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${item.price}</td>
                <td style="text-align: right;">${thanhTienDep} VNĐ</td>
            </tr>`
            ;
    });
    alert('Thanh toán thành công! Đang tiến hành xuất hóa đơn...');
    // Tương tự như nút mua hàng
    let tongTienDep = tongTienToanBo.toLocaleString('vi-VN');
    const today = new Date();
    const dateString = today.toLocaleDateString('vi-VN');
    const invoiceHTML = `
        <html>
        <head>
            <title>Hóa Đơn Giỏ Hàng - Nội thất Vella</title>
            <style>
                body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
                .invoice-box { max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .header { text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { color: #2c3e50; margin: 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 12px; border-bottom: 1px solid #ddd; }
                th { background-color: #f8f9fa; }
                .total { font-size: 22px; font-weight: bold; color: #e74c3c; text-align: right; margin-top: 20px; }
                .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #7f8c8d; font-style: italic; }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="header">
                    <h1>NỘI THẤT VELLA</h1>
                    <p>Số 02 Nguyễn Văn Cừ, P. Ninh Kiều, TP Cần Thơ</p>
                    <p>Điện thoại: 1900686868</p>
                </div>
                
                <h2 style="text-align: center;">HÓA ĐƠN THANH TOÁN</h2>
                <p><strong>Ngày xuất:</strong> ${dateString}</p>
                <p><strong>Khách hàng:</strong> Khách vãng lai</p>
                
                <table>
                    <tr>
                        <th style="text-align: left;">Tên sản phẩm</th>
                        <th style="text-align: center;">SL</th>
                        <th style="text-align: right;">Đơn giá</th>
                        <th style="text-align: right;">Thành tiền</th>
                    </tr>
                    ${danhSachSanPhamHTML}
                </table>
                
                <div class="total">
                    Tổng thanh toán: ${tongTienDep} VNĐ
                </div>
                
                <div class="footer">
                    Cảm ơn quý khách đã tin tưởng và mua sắm tại Vella!<br>
                    (Vui lòng giữ lại hóa đơn để đối chiếu bảo hành)
                </div>
            </div>

            <script>
                // Mở hộp thoại In ấn ngay khi load xong
                window.onload = function() { 
                    window.print(); 
                }
            </script>
        </body>
        </html>`
        ;
    const invoiceWindow = window.open('', '_blank', 'width=800,height=800');
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    // Xóa hàng khỏi vỏ hàng
    localStorage.removeItem('vellaCart');
    // Hiển thị lại giỏ hàng
    hienThiGioHang();
    const cartModal = document.getElementById('cart-modal');
    // Ẩn giỏ hàng vì đã thanh toán hết
    cartModal.style.display = 'none';
});