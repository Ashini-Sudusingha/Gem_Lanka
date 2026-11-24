let currentStep = 1;
const totalSteps = 4;

async function loadStoreData() {
    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadStoreData");
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                if (json.bussinessList && json.bussinessList.length > 0) {
                    loadSelect("category", json.bussinessList, "name", "Select Business Category");
                }
                if (json.positionList && json.positionList.length > 0) {
                    loadSelect("position", json.positionList, "name", "Select Position");
                }
                if (json.cityList && json.cityList.length > 0) {
                    loadSelect("cityId", json.cityList, "name", "Select City / District");
                }
            }
        }
    } catch (err) {
        console.warn("Using offline / fallback store metadata:", err);
    }
}

function loadSelect(selectId, items, property, placeholder) {
    const select = document.getElementById(selectId);
    if (!select || !items || !Array.isArray(items) || items.length === 0) return;
    select.innerHTML = `<option value="0" selected>${placeholder}</option>`;
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item[property];
        select.appendChild(option);
    });
}

function showStatus(message, isSuccess = false) {
    const el = document.getElementById("statusMessage");
    if (!el) return;
    el.textContent = message;
    el.className = `jl-alert ${isSuccess ? 'jl-alert-success' : 'jl-alert-danger'}`;
    el.style.display = "block";
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearStatus() {
    const el = document.getElementById("statusMessage");
    if (!el) return;
    el.textContent = '';
    el.style.display = "none";
}

function validateStep(step) {
    clearStatus();
    if (step === 1) {
        const name = document.getElementById("bussName").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const category = document.getElementById("category").value;
        const position = document.getElementById("position").value;

        if (!name) {
            showStatus("Please enter your Business / Store Name!");
            document.getElementById("bussName").focus();
            return false;
        }
        if (!email || !email.includes("@")) {
            showStatus("Please enter a valid Business Email address!");
            document.getElementById("email").focus();
            return false;
        }
        if (!mobile || mobile.length < 8) {
            showStatus("Please enter a valid Official Contact Mobile number!");
            document.getElementById("mobile").focus();
            return false;
        }
        if (category === "0") {
            showStatus("Please select a Business Category!");
            document.getElementById("category").focus();
            return false;
        }
        if (position === "0") {
            showStatus("Please select your Position in the business!");
            document.getElementById("position").focus();
            return false;
        }
        return true;
    }

    if (step === 2) {
        const ngja = document.getElementById("ngjaLicenseNo").value.trim();
        const nic = document.getElementById("nic").value.trim();

        if (!ngja) {
            showStatus("NGJA Dealer License Number is required for gemstone merchant trading!");
            document.getElementById("ngjaLicenseNo").focus();
            return false;
        }
        if (!nic) {
            showStatus("Owner / Authorized Trader National ID (NIC or Passport) is required!");
            document.getElementById("nic").focus();
            return false;
        }
        return true;
    }

    if (step === 3) {
        const address = document.getElementById("address").value.trim();
        const cityId = document.getElementById("cityId").value;

        if (!address) {
            showStatus("Please enter your Shop or Office physical address!");
            document.getElementById("address").focus();
            return false;
        }
        if (cityId === "0") {
            showStatus("Please select your City / Gem Trade Hub!");
            document.getElementById("cityId").focus();
            return false;
        }
        return true;
    }

    return true;
}

function goToStep(targetStep) {
    if (targetStep > currentStep) {
        for (let s = currentStep; s < targetStep; s++) {
            if (!validateStep(s)) return;
        }
    }

    clearStatus();
    currentStep = targetStep;

    // Update step cards visibility
    for (let i = 1; i <= totalSteps; i++) {
        const card = document.getElementById(`stepCard${i}`);
        const indicator = document.getElementById(`stepIndicator${i}`);
        if (card) {
            card.classList.toggle("active", i === currentStep);
        }
        if (indicator) {
            indicator.classList.toggle("active", i === currentStep);
            indicator.classList.toggle("completed", i < currentStep);
        }
    }

    // Update progress bar
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const progressBar = document.getElementById("stepperProgressBar");
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }

    // If step 4, populate review summary
    if (currentStep === 4) {
        document.getElementById("revStoreName").textContent = document.getElementById("bussName").value.trim() || '-';
        document.getElementById("revEmail").textContent = document.getElementById("email").value.trim() || '-';
        document.getElementById("revMobile").textContent = document.getElementById("mobile").value.trim() || '-';
        document.getElementById("revLicense").textContent = document.getElementById("ngjaLicenseNo").value.trim() || '-';
        document.getElementById("revNIC").textContent = document.getElementById("nic").value.trim() || '-';
        const citySelect = document.getElementById("cityId");
        document.getElementById("revCity").textContent = citySelect.options[citySelect.selectedIndex]?.text || '-';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function jumpToStep(step) {
    if (step <= currentStep) {
        goToStep(step);
    } else {
        goToStep(step);
    }
}

function handleFileSelect(input) {
    const fileDisplay = document.getElementById("fileSelectedDisplay");
    const nameLabel = document.getElementById("fileNameLabel");
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        nameLabel.innerHTML = `<i class="fa-solid fa-file-check"></i> ${file.name} (${sizeMb} MB)`;
        fileDisplay.style.display = "flex";
    }
}

function removeSelectedFile() {
    const input = document.getElementById("liseImage");
    const fileDisplay = document.getElementById("fileSelectedDisplay");
    if (input) input.value = "";
    if (fileDisplay) fileDisplay.style.display = "none";
}

function checkPasswordStrength() {
    const pwd = document.getElementById("password").value;
    const bar = document.getElementById("pwdStrengthBar");
    if (!bar) return;

    if (!pwd) {
        bar.style.width = "0%";
        bar.style.backgroundColor = "#eee";
        return;
    }

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 1) {
        bar.style.width = "25%";
        bar.style.backgroundColor = "#EF4444";
    } else if (strength === 2 || strength === 3) {
        bar.style.width = "65%";
        bar.style.backgroundColor = "#F59E0B";
    } else {
        bar.style.width = "100%";
        bar.style.backgroundColor = "#10B981";
    }
}

async function submitFinalStore() {
    clearStatus();
    const password = document.getElementById("password").value;
    const comfirmPassword = document.getElementById("comfirmPassword").value;
    const termsCheck = document.getElementById("termsCheck");

    if (!password) {
        showStatus("Please set a Store Password!");
        document.getElementById("password").focus();
        return;
    }
    if (password.length < 8) {
        showStatus("Store Password must be at least 8 characters long!");
        document.getElementById("password").focus();
        return;
    }
    if (password !== comfirmPassword) {
        showStatus("Password and Confirm Password do not match!");
        document.getElementById("comfirmPassword").focus();
        return;
    }
    if (termsCheck && !termsCheck.checked) {
        showStatus("You must accept the JemLanka Merchant Standards and NGJA regulations to proceed!");
        return;
    }

    const form = new FormData();
    form.append("bussName", document.getElementById("bussName").value.trim());
    form.append("email", document.getElementById("email").value.trim());
    form.append("mobile", document.getElementById("mobile").value.trim());
    form.append("categoryId", document.getElementById("category").value);
    form.append("positionId", document.getElementById("position").value);
    form.append("ngjaLicenseNo", document.getElementById("ngjaLicenseNo").value.trim());
    form.append("brNumber", document.getElementById("brNumber").value.trim());
    form.append("nic", document.getElementById("nic").value.trim());
    form.append("address", document.getElementById("address").value.trim());
    form.append("cityId", document.getElementById("cityId").value);
    form.append("bankName", document.getElementById("bankName").value.trim());
    form.append("bankBranch", document.getElementById("bankBranch").value.trim());
    form.append("accountNo", document.getElementById("accountNo").value.trim());
    form.append("accountHolder", document.getElementById("accountHolder").value.trim());
    form.append("password", password);
    form.append("comfirmPassword", comfirmPassword);

    const liseImageInput = document.getElementById("liseImage");
    if (liseImageInput && liseImageInput.files.length > 0) {
        form.append("liseImage", liseImageInput.files[0]);
    }

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Application...`;
    }

    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/CreateStore", {
            method: "POST",
            body: form,
            credentials: "include"
        });

        if (response.status === 401) {
            showStatus("Please sign in to your user account first before registering a store!", false);
            setTimeout(() => {
                window.location.href = "sign-in.html";
            }, 1800);
            return;
        }

        const json = await response.json();
        if (response.ok && json.status) {
            showStatus(json.message || "Store registered successfully! Your NGJA license is under verification.", true);
            setTimeout(() => {
                // If in iframe, notify parent or load account
                if (window.top && window.top !== window) {
                    window.top.location.href = "profile-dashboard.html";
                }
            }, 2500);
        } else {
            showStatus(json.message || "Store registration failed. Please review your details.", false);
        }
    } catch (err) {
        console.error("Store registration error:", err);
        showStatus("An unexpected network error occurred while submitting your application.", false);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-gem"></i> Submit Merchant Application`;
        }
    }
}
