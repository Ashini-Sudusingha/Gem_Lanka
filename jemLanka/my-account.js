const editProfileModal = document.getElementById('edit-profile-modal');
const editAddressModal = document.getElementById('edit-address-modal');

let cachedUserData = null;
let provinceList = [];
let cityList = [];
let countryList = [];

function showMessage(elId, text, isSuccess = false) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = text;
    el.className = `jl-alert-box active ${isSuccess ? 'jl-alert-success' : 'jl-alert-danger'}`;
    el.style.display = 'block';
}

function clearMessage(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = '';
    el.style.display = 'none';
}

function personalInforOpen() {
    clearMessage('message');
    const displayFirstName = document.getElementById('dfirstName');
    const displayLastName = document.getElementById('dlastName');

    document.getElementById('firstName').value = displayFirstName.textContent !== '-' ? displayFirstName.textContent : '';
    document.getElementById('lastName').value = displayLastName.textContent !== '-' ? displayLastName.textContent : '';
    document.getElementById('currentPasswordInput').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

    editProfileModal.classList.add('active');
}

function personalInforClose() {
    clearMessage('message');
    editProfileModal.classList.remove('active');
}

function openEditAddressModel() {
    clearMessage('messageAddress');

    // Pre-populate if address exists
    const dpostal = document.getElementById('dpostal').textContent;
    const dline1 = document.getElementById('dline1').textContent;
    const dline2 = document.getElementById('dline2').textContent;
    const dmobileaddress = document.getElementById('dmobileaddress').textContent;

    document.getElementById('postalcode').value = dpostal !== '-' ? dpostal : '';
    document.getElementById('line1').value = dline1 || '';
    document.getElementById('line2').value = dline2 || '';
    document.getElementById('mobile').value = (dmobileaddress !== '-' && dmobileaddress !== '') ? dmobileaddress : (cachedUserData?.mobile || '');

    editAddressModal.classList.add('active');
}

function addressModelClose() {
    clearMessage('messageAddress');
    editAddressModal.classList.remove('active');
}

async function getUserData() {
    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/MyProfile", {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401) {
            console.warn("User not authenticated in session");
            document.getElementById("header").textContent = "Welcome to JemLanka!";
            document.getElementById("date").textContent = "Please sign in to view and edit your profile";
            document.getElementById("dfirstName").textContent = "Guest";
            document.getElementById("dlastName").textContent = "User";
            document.getElementById("demail").textContent = "Not signed in";
            document.getElementById("dmobile").textContent = "-";
            document.getElementById("userAvatarInitials").textContent = "JL";
            
            // Optionally redirect parent window to sign-in page
            if (window.top && window.top.location.href.indexOf('profile-dashboard.html') !== -1) {
                // Keep page viewable for preview if user is navigating directly
            }
            return;
        }

        if (response.ok) {
            const text = await response.text();
            if (!text || text.trim() === "") {
                console.warn("Backend session inactive or empty response");
                document.getElementById("header").textContent = "Welcome to JemLanka!";
                document.getElementById("date").textContent = "Please sign in to view and edit your profile";
                document.getElementById("dfirstName").textContent = "Guest";
                document.getElementById("dlastName").textContent = "User";
                document.getElementById("demail").textContent = "Not signed in";
                document.getElementById("dmobile").textContent = "-";
                document.getElementById("userAvatarInitials").textContent = "JL";
                return;
            }

            let json;
            try {
                json = JSON.parse(text);
            } catch (err) {
                console.warn("Unable to parse profile JSON:", text);
                return;
            }

            if (!json.status) {
                console.warn(json.message);
                return;
            }

            cachedUserData = json;

            // Welcome banner & metadata
            document.getElementById("header").textContent = `Hello, ${json.firstName} ${json.lastName}!`;
            document.getElementById("date").textContent = `JemLanka Member Since ${json.since}`;

            // Personal info values
            document.getElementById("dfirstName").textContent = json.firstName || '-';
            document.getElementById("dlastName").textContent = json.lastName || '-';
            document.getElementById("demail").textContent = json.email || '-';
            document.getElementById("dmobile").textContent = json.mobile || 'Not provided';

            // Monogram initials
            const fnFirst = json.firstName ? json.firstName.charAt(0) : '';
            const lnFirst = json.lastName ? json.lastName.charAt(0) : '';
            const initials = (fnFirst + lnFirst).toUpperCase() || 'JL';
            document.getElementById("userAvatarInitials").textContent = initials;

            // Masked password with cached value
            const currentPasswordEl = document.getElementById("currentPassword");
            currentPasswordEl.textContent = "••••••••••••";
            currentPasswordEl.dataset.pwd = json.password || "";

            // Shipping Address Display
            const addressBox = document.getElementById("addressDisplayBox");
            const emptyBox = document.getElementById("addressEmptyBox");
            const btnActionText = document.getElementById("btnAddressActionText");

            if (json.addressList && Array.isArray(json.addressList) && json.addressList.length > 0) {
                const address = json.addressList[0];
                document.getElementById("dline1").textContent = address.lineOne || '';
                document.getElementById("dline2").textContent = address.lineTwo || '';
                document.getElementById("dcity").textContent = address.city?.name || '';
                document.getElementById("dprovince").textContent = address.city?.province?.name || '';
                document.getElementById("dcountry").textContent = address.city?.province?.country?.name || '';
                document.getElementById("dpostal").textContent = address.postalCode || '-';
                document.getElementById("dmobileaddress").textContent = address.mobile || '-';

                addressBox.style.display = "flex";
                emptyBox.style.display = "none";
                if (btnActionText) btnActionText.textContent = "Edit Address";
            } else {
                addressBox.style.display = "none";
                emptyBox.style.display = "block";
                if (btnActionText) btnActionText.textContent = "Add Address";
            }
        } else {
            console.error("Failed to load user profile: HTTP " + response.status);
        }
    } catch (err) {
        console.error("Error in getUserData:", err);
    }
}

async function loadAddressData() {
    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadAddressData");
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                countryList = json.countryList || [];
                provinceList = json.provinceList || [];
                cityList = json.cityList || [];
                loadSelect("country", countryList, "name", "Select Country");
            } else {
                showMessage("messageAddress", "Could not load address configuration");
            }
        }
    } catch (err) {
        console.error("Error loading address metadata:", err);
    }
}

function loadSelect(selectId, items, property, placeholder) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="0" selected>${placeholder}</option>`;
    if (!items || !Array.isArray(items)) return;
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item[property];
        select.appendChild(option);
    });
}

function loadProvince() {
    const countryId = parseInt(document.getElementById("country").value, 10);
    const provinceSelect = document.getElementById("province");
    provinceSelect.innerHTML = `<option value="0" selected>Select Province</option>`;
    document.getElementById("city").innerHTML = `<option value="0" selected>Select City</option>`;

    if (!countryId) return;

    provinceList.forEach(item => {
        if (item.country && item.country.id === countryId) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            provinceSelect.appendChild(option);
        }
    });
}

function loadCity() {
    const provinceId = parseInt(document.getElementById("province").value, 10);
    const citySelect = document.getElementById("city");
    citySelect.innerHTML = `<option value="0" selected>Select City</option>`;

    if (!provinceId) return;

    cityList.forEach(item => {
        if (item.province && item.province.id === provinceId) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            citySelect.appendChild(option);
        }
    });
}

async function saveProfileChanges() {
    clearMessage("message");
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const currentPassword = document.getElementById("currentPasswordInput").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName) {
        showMessage("message", "First Name is required!");
        return;
    }
    if (!lastName) {
        showMessage("message", "Last Name is required!");
        return;
    }

    if (newPassword || confirmPassword) {
        if (!currentPassword) {
            showMessage("message", "Please enter your current password to change password!");
            return;
        }
        if (newPassword !== confirmPassword) {
            showMessage("message", "New password and confirm password do not match!");
            return;
        }
        if (newPassword.length < 8) {
            showMessage("message", "New password must be at least 8 characters long!");
            return;
        }
    }

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/MyProfile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDataObject),
            credentials: "include"
        });

        const json = await response.json();
        if (response.ok && json.status) {
            showMessage("message", "Profile updated successfully!", true);
            getUserData();
            setTimeout(() => {
                personalInforClose();
            }, 1000);
        } else {
            showMessage("message", json.message || "Failed to update profile!");
        }
    } catch (err) {
        console.error("Save profile error:", err);
        showMessage("message", "An unexpected error occurred while saving profile.");
    }
}

async function saveAddressChanges() {
    clearMessage("messageAddress");
    const country = document.getElementById("country").value;
    const province = document.getElementById("province").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postalcode").value.trim();
    const lineOne = document.getElementById("line1").value.trim();
    const lineTwo = document.getElementById("line2").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    if (country === "0") {
        showMessage("messageAddress", "Please select a country");
        return;
    }
    if (province === "0") {
        showMessage("messageAddress", "Please select a province");
        return;
    }
    if (city === "0") {
        showMessage("messageAddress", "Please select a city");
        return;
    }
    if (!postalCode) {
        showMessage("messageAddress", "Please enter your postal code");
        return;
    }
    if (!lineOne) {
        showMessage("messageAddress", "Please enter address line 01");
        return;
    }
    if (!mobile) {
        showMessage("messageAddress", "Please enter your contact mobile number");
        return;
    }

    const addressObject = {
        countryId: parseInt(country, 10),
        provinceId: parseInt(province, 10),
        cityId: parseInt(city, 10),
        postalCode: postalCode,
        lineOne: lineOne,
        lineTwo: lineTwo,
        mobile: mobile
    };

    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadAddressData", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(addressObject),
            credentials: "include"
        });

        const json = await response.json();
        if (response.ok && json.status) {
            showMessage("messageAddress", "Shipping address saved successfully!", true);
            getUserData();
            setTimeout(() => {
                addressModelClose();
            }, 1000);
        } else {
            showMessage("messageAddress", json.message || "Failed to save address!");
        }
    } catch (err) {
        console.error("Save address error:", err);
        showMessage("messageAddress", "An unexpected error occurred while saving address.");
    }
}
