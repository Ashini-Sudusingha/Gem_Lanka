function closealert() {
    const errorM = document.getElementById("errorMessage");
    const successM = document.getElementById("successMessage");
    if (errorM) errorM.classList.add("hidden");
    if (successM) successM.classList.add("hidden");
}

async function signUp() {
    const firstNameInput = document.getElementById("firstname");
    const lastNameInput = document.getElementById("lastname");
    const emailInput = document.getElementById("email");
    const mobileInput = document.getElementById("mobile");
    const passwordInput = document.getElementById("password");
    const confirmpasswordInput = document.getElementById("confirmpassword");
    const checkbox = document.getElementById('checkbox');

    const successM = document.getElementById("successMessage");
    const susstype = document.getElementById("successtype");
    const errorM = document.getElementById("errorMessage");
    const errortype = document.getElementById("errortype");

    function showError(msg) {
        if (errortype) errortype.innerHTML = msg;
        if (errorM) errorM.classList.remove("hidden");
        if (successM) successM.classList.add("hidden");
    }

    function showSuccess(msg) {
        if (susstype) susstype.innerHTML = msg;
        if (successM) successM.classList.remove("hidden");
        if (errorM) errorM.classList.add("hidden");
    }

    const firstName = firstNameInput ? firstNameInput.value.trim() : "";
    const lastName = lastNameInput ? lastNameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const mobile = mobileInput ? mobileInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmpassword = confirmpasswordInput ? confirmpasswordInput.value : "";

    // Client-side Validations
    if (!firstName) {
        showError("Please enter your First Name!");
        if (firstNameInput) firstNameInput.focus();
        return;
    }
    if (!lastName) {
        showError("Please enter your Last Name!");
        if (lastNameInput) lastNameInput.focus();
        return;
    }
    if (!email) {
        showError("Please enter your Email Address!");
        if (emailInput) emailInput.focus();
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError("Please enter a valid email address!");
        if (emailInput) emailInput.focus();
        return;
    }
    if (!mobile) {
        showError("Please enter your Mobile Number!");
        if (mobileInput) mobileInput.focus();
        return;
    }
    // Clean and normalize mobile to 10 digits starting with 0
    let cleanMobile = mobile.replace(/[\s\-\(\)]/g, "");
    if (cleanMobile.startsWith("+94")) {
        cleanMobile = "0" + cleanMobile.substring(3);
    } else if (cleanMobile.startsWith("94") && cleanMobile.length === 11) {
        cleanMobile = "0" + cleanMobile.substring(2);
    } else if (!cleanMobile.startsWith("0") && cleanMobile.length === 9) {
        cleanMobile = "0" + cleanMobile;
    }

    const mobilePattern = /^0[0-9]{9}$/;
    if (!mobilePattern.test(cleanMobile)) {
        showError("Please enter a valid 10-digit mobile number (e.g. 0771234567 or +94771234567)!");
        if (mobileInput) mobileInput.focus();
        return;
    }
    if (!password) {
        showError("Please enter a Password!");
        if (passwordInput) passwordInput.focus();
        return;
    }
    if (password.length < 8) {
        showError("Password must be at least 8 characters long!");
        if (passwordInput) passwordInput.focus();
        return;
    }
    if (password.length > 20) {
        showError("Password cannot exceed 20 characters!");
        if (passwordInput) passwordInput.focus();
        return;
    }
    const strongPasswordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).{8,}$/;
    if (!strongPasswordPattern.test(password)) {
        showError("Password must include uppercase, lowercase, number, and a special character (@#$%^&+=!_)!");
        if (passwordInput) passwordInput.focus();
        return;
    }
    if (!confirmpassword) {
        showError("Please confirm your password!");
        if (confirmpasswordInput) confirmpasswordInput.focus();
        return;
    }
    if (password !== confirmpassword) {
        showError("Passwords do not match!");
        if (confirmpasswordInput) confirmpasswordInput.focus();
        return;
    }
    if (checkbox && !checkbox.checked) {
        showError("Please accept the terms and conditions to proceed.");
        return;
    }

    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: cleanMobile,
        password: password,
        confirmpassword: confirmpassword
    };

    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/SingUp", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                showSuccess(json.message || "Registration successful! Verification code sent to your email.");
                // Open OTP modal directly after 1 second
                setTimeout(() => {
                    openOtp();
                }, 1000);
            } else {
                showError(json.message || "Registration failed!");
            }
        } else {
            showError("Server error (" + response.status + "). Please try again.");
        }
    } catch (error) {
        console.error("SignUp network error:", error);
        showError("Failed to connect to backend server. Make sure GlassFish is running.");
    }
}

const otpModal = document.getElementById('otp-modal');
function openOtp() {
    const modal = document.getElementById('otp-modal');
    const otpInputs = document.querySelectorAll('.otp-input');
    if (modal) modal.classList.add('active');
    if (otpInputs && otpInputs.length > 0) otpInputs[0].focus();
}

function closeOtpModal() {
    const modal = document.getElementById('otp-modal');
    if (modal) modal.classList.remove('active');
}
