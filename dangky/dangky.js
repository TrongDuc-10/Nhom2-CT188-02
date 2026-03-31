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

function successMessage(elmt) {
    const formRow = elmt.parentElement;

    formRow.classList.remove("error");
    formRow.classList.add("success");

    let msg = formRow.querySelector(".message");
    if (msg) msg.textContent = "";
}

// ===== CHECK =====

function checkEmpty(elmt, name) {
    if (elmt.value.trim() === "") {
        errorMessage(elmt, name + " không được để trống");
        return false;
    }
    successMessage(elmt);
    return true;
}

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

function checkPassword(elmt) {
    if (elmt.value.length < 6) {
        errorMessage(elmt, "Mật khẩu phải >= 6 ký tự");
        return false;
    }
    successMessage(elmt);
    return true;
}

function checkConfirm(pass, confirm) {
    if (confirm.value !== pass.value) {
        errorMessage(confirm, "Mật khẩu không khớp");
        return false;
    }
    successMessage(confirm);
    return true;
}

// ===== GET ELEMENT =====

const first = document.getElementById("first-name");
const last = document.getElementById("last-name");
const phone = document.getElementById("number");
const email = document.getElementById("email");
const pass = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

// ===== BLUR (giống thầy) =====

first.addEventListener("blur", () => checkEmpty(first, "Họ"));
last.addEventListener("blur", () => checkEmpty(last, "Tên"));
phone.addEventListener("blur", () => checkPhone(phone));
email.addEventListener("blur", () => checkEmail(email));
pass.addEventListener("blur", () => checkPassword(pass));
confirmPassword.addEventListener("blur", () => checkConfirm(pass, confirmPassword));

// ===== SUBMIT =====

// chọn form rõ ràng theo id để tránh nhầm form khác
const form = document.getElementById("register-form") || document.querySelector("form");

if (!form) {
    console.error('Form đăng ký không tìm thấy. Kiểm tra `id="register-form"` trong HTML.');
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid =
        checkEmpty(first, "Họ") &&
        checkEmpty(last, "Tên") &&
        checkPhone(phone) &&
        checkEmail(email) &&
        checkPassword(pass) &&
        checkConfirm(pass, confirmPassword);

    console.log('Form validate result:', isValid);

    if (isValid) {
        alert("Đăng ký thành công 🎉");
        // khi đăng ký thành công -> xóa mọi thông tin nhập và reset trạng thái hiển thị
        clearForm();
    }
});

// Clear form inputs and validation UI
function clearForm() {
    if (!form) return;
    try {
        // reset values
        if (typeof form.reset === 'function') form.reset();
    } catch (err) {
        console.warn('Không thể gọi form.reset():', err);
    }

    // remove validation classes and messages
    const groups = form.querySelectorAll('.input-group');
    groups.forEach(g => {
        g.classList.remove('error', 'success');
        const msg = g.querySelector('.message');
        if (msg) msg.textContent = '';
    });

    // focus vào ô tên đầu tiên để UX tốt hơn
    if (first) first.focus();
}