// Hiển thị thông báo lỗi cho một input
// elmt: phần tử input (ví dụ input element)
// message: chuỗi thông báo lỗi sẽ được hiển thị dưới input
function errorMessage(elmt, message) {
    const formRow = elmt.parentElement;

    formRow.classList.remove("success");
    formRow.classList.add("error");

    let msg = formRow.querySelector(".message");
    if (!msg) {
        msg = document.createElement("div");
        msg.className = "message";
        formRow.appendChild(msg);
    }
    msg.textContent = message;
}

// Hàm đánh dấu input là success (không có lỗi)
// Xóa class 'error' nếu có và đặt class 'success'
function successMessage(elmt) {
    const formRow = elmt.parentElement;

    formRow.classList.remove("error");
    formRow.classList.add("success");

    let msg = formRow.querySelector(".message");
    if (msg) msg.textContent = "";
}

// Hàm kiểm tra input không rỗng
// name: tên trường để hiển thị trong thông báo
function checkEmpty(elmt, name) {
    if (elmt.value.trim() === "") {
        errorMessage(elmt, name + " không được để trống");
        return false;
    }
    successMessage(elmt);
    return true;
}

// Kiểm tra số điện thoại: chỉ cho phép 10 chữ số (không dấu, không khoảng trắng)
function checkPhone(elmt) {
    const regex = /^[0-9]{10}$/;
    if (elmt.value.trim() === "") {
        errorMessage(elmt, "Số điện thoại không được để trống");
        return false;
    } else if (!regex.test(elmt.value)) {
        errorMessage(elmt, "Số điện thoại không hợp lệ");
        return false;
    }
    successMessage(elmt);
    return true;
}

// Kiểm tra định dạng email
function checkEmail(elmt) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (elmt.value.trim() === "") {
        errorMessage(elmt, "Email không được để trống");
        return false;
    } else if (!regex.test(elmt.value)) {
        errorMessage(elmt, "Email không hợp lệ");
        return false;
    }
    successMessage(elmt);
    return true;
}

// Kiểm tra mật khẩu tối thiểu 6 ký tự
function checkPassword(elmt) {
    if (elmt.value.length < 6) {
        errorMessage(elmt, "Mật khẩu phải >= 6 ký tự");
        return false;
    }
    successMessage(elmt);
    return true;
}

// Kiểm tra ô xác nhận mật khẩu có giống ô mật khẩu hay không
// pass: phần tử mật khẩu; confirm: phần tử xác nhận mật khẩu
function checkConfirm(pass, confirm) {
    if (confirm.value !== pass.value) {
        errorMessage(confirm, "Mật khẩu không khớp");
        return false;
    }
    successMessage(confirm);
    return true;
}

// Hàm xóa dữ liệu form và reset trạng thái validation
function clearForm() {
    if (!form) return;
    try {
        // Gọi form.reset() sẽ thiết lập lại các value của các input về mặc định
        if (typeof form.reset === 'function') form.reset();
    } catch (err) {
        console.warn('Không thể gọi form.reset():', err);
    }

    // Xóa class error/success và nội dung thông báo dưới mỗi input
    const groups = form.querySelectorAll('.input-group');
    groups.forEach(g => {
        g.classList.remove('error', 'success');
        const msg = g.querySelector('.message');
        if (msg) msg.textContent = '';
    });
}
//Lấy phần tử theo id

const first = document.getElementById("first-name");
const last = document.getElementById("last-name");
const phone = document.getElementById("number");
const email = document.getElementById("email");
const pass = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

// Kiểm tra khi rời khỏi input (blur)

first.addEventListener("blur", () => checkEmpty(first, "Họ"));
last.addEventListener("blur", () => checkEmpty(last, "Tên"));
phone.addEventListener("blur", () => checkPhone(phone));
email.addEventListener("blur", () => checkEmail(email));
pass.addEventListener("blur", () => checkPassword(pass));
confirmPassword.addEventListener("blur", () => checkConfirm(pass, confirmPassword));

// Lấy phần tử form bằng id (nếu có), nếu không thì lấy form đầu tiên trên trang
const form = document.getElementById("register-form") || document.querySelector("form");

if (!form) {
    console.error('Form đăng ký không tìm thấy. Kiểm tra `id="register-form"` trong HTML.');
}

// Xử lý khi người dùng submit form
// Tránh trình duyệt submit mặc định để kiểm tra bằng JS
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Thực hiện lần lượt các kiểm tra cho các input
    let isValid =
        checkEmpty(first, "Họ") &&
        checkEmpty(last, "Tên") &&
        checkPhone(phone) &&
        checkEmail(email) &&
        checkPassword(pass) &&
        checkConfirm(pass, confirmPassword);

        // In ra console kết quả (true nếu tất cả hợp lệ, false nếu có lỗi)
    console.log('Form validate result:', isValid);

    if (isValid) {
        // Nếu tất cả hợp lệ, hiển thị thông báo thành công
        alert("Đăng ký thành công 🎉");
        // sau khi đăng ký thành công, reset form và giao diện validation
        clearForm();
    }
});

