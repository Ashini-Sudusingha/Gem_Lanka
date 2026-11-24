function closeOtpModal() {
  const otpModal = document.getElementById('otp-modal');
  if (otpModal) {
    otpModal.classList.remove('active');
  }
}

async function verifyAccount() {
  const num1 = document.getElementById("num1") ? document.getElementById("num1").value.trim() : "";
  const num2 = document.getElementById("num2") ? document.getElementById("num2").value.trim() : "";
  const num3 = document.getElementById("num3") ? document.getElementById("num3").value.trim() : "";
  const num4 = document.getElementById("num4") ? document.getElementById("num4").value.trim() : "";
  const num5 = document.getElementById("num5") ? document.getElementById("num5").value.trim() : "";
  const num6 = document.getElementById("num6") ? document.getElementById("num6").value.trim() : "";

  const msgEl = document.getElementById("message");

  if (!num1 || !num2 || !num3 || !num4 || !num5 || !num6) {
    if (msgEl) {
      msgEl.style.color = "#DC2626";
      msgEl.innerHTML = "Please enter all 6 digits of your verification code.";
      msgEl.classList.remove("hidden");
    }
    return;
  }

  const verification = {
    num1: num1,
    num2: num2,
    num3: num3,
    num4: num4,
    num5: num5,
    num6: num6
  };

  try {
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/VerifyEmail", {
      method: "POST",
      body: JSON.stringify(verification),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (response.ok) {
      const json = await response.json();
      if (json.status) {
        closeOtpModal();
        window.location = "index.html";
      } else {
        if (msgEl) {
          msgEl.style.color = "#DC2626";
          msgEl.innerHTML = json.message || "Invalid verification code.";
          msgEl.classList.remove("hidden");
        }
      }
    } else {
      if (msgEl) {
        msgEl.style.color = "#DC2626";
        msgEl.innerHTML = "Verification failed. Please try again.";
        msgEl.classList.remove("hidden");
      }
    }
  } catch (err) {
    console.error("Verification error:", err);
    if (msgEl) {
      msgEl.style.color = "#DC2626";
      msgEl.innerHTML = "Cannot connect to server. Please ensure backend is running.";
      msgEl.classList.remove("hidden");
    }
  }
}

function resendOtp() {
  const msgEl = document.getElementById("message");
  if (msgEl) {
    msgEl.style.color = "#16A34A";
    msgEl.innerHTML = "Please check your email inbox for your 6-digit code.";
    msgEl.classList.remove("hidden");
  }
}

// Auto-advance OTP inputs on type and backspace
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".otp-input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length >= 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
});
