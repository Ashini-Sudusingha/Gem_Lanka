async function signIn() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorM = document.getElementById("errorMessage");
    const errortype = document.getElementById("errortype");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
        if (errortype) errortype.innerHTML = "Please enter both email and password.";
        if (errorM) errorM.classList.remove("hidden");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/JemLankaBackEnd/SignIn",
            {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                if (json.message === "1") {
                    openOtp();
                } else {
                    window.location = "index.html";
                }
            } else {
                if (errortype) errortype.innerHTML = json.message || "Invalid email or password.";
                if (errorM) errorM.classList.remove("hidden");
            }
        } else {
            if (errortype) errortype.innerHTML = "Sign in failed (Server error: " + response.status + "). Please try again.";
            if (errorM) errorM.classList.remove("hidden");
        }
    } catch (e) {
        console.error("Sign in error:", e);
        if (errortype) errortype.innerHTML = "Cannot connect to backend server. Please make sure GlassFish is running.";
        if (errorM) errorM.classList.remove("hidden");
    }
}

const otpModal = document.getElementById('otp-modal');
function openOtp() {
    const otpInputs = document.querySelectorAll('.otp-input');
    if (otpModal) {
        otpModal.classList.add('active');
    }
    if (otpInputs && otpInputs.length > 0) {
        otpInputs[0].focus();
    }
}

function closeOtpModal() {
    if (otpModal) {
        otpModal.classList.remove('active');
    }
}
