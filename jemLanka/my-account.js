

const editProfileModal = document.getElementById('edit-profile-modal');
const editAddressModal = document.getElementById('edit-address-modal');

function personalInforOpen() {
    const editProfileButton = document.getElementById('edit-profile-button');
    const editPersonalInfoButton = document.getElementById('edit-personal-info-button');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const saveChangesButton = document.getElementById('save-changes-button'); // Added save changes button reference

    // Display elements for personal info
    const displayFirstName = document.getElementById('dfirstName');
    const displayLastName = document.getElementById('dlastName');


    // Input fields in the modal
    const inputFirstName = document.getElementById('firstName');
    const inputLastName = document.getElementById('lastName');




    editProfileModal.classList.add('active');
    // Populate modal fields with current display values
    inputFirstName.value = displayFirstName.textContent;
    inputLastName.value = displayLastName.textContent;



    //   openSidebar(sidebar, sidebarOverlay);

}

function personalInforClose() {
    // closeSidebar(sidebar,sidebarOverlay);
    closeModal(editProfileModal);

}

function addressModelClose() {
    closeModal(editAddressModal);
}

function openModal() {

}

function closeModal(editProfileModal) {
    editProfileModal.classList.remove('active');
}

function openEditAddressModel() {
    document.getElementById("postalcode").value = document.getElementById("dpostal").textContent;
    document.getElementById("line1").value = document.getElementById("dline1").textContent;
    document.getElementById("line2").value = document.getElementById("dline2").textContent;
    document.getElementById("mobile").value = document.getElementById("dmobile").textContent;

    const addressModel = document.getElementById("edit-address-modal");
    addressModel.classList.add("active");

}

async function getUserData() {

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/MyProfile",
        {
            method: "GET",
            credentials: "include"
        }
    );
    if (response.ok) {
        const json = await response.json();
        console.log(json);
        console.log(json.addressList);
        document.getElementById("header").innerHTML = `Hello, ${json.firstName} ${json.lastName} Welcome to your profile!`;
        document.getElementById("date").innerHTML = `Jemlanaka Member Since ${json.since}`;
        document.getElementById("dfirstName").innerHTML = json.firstName;
        document.getElementById("dlastName").innerHTML = json.lastName;
        document.getElementById("demail").innerHTML = json.email;
        document.getElementById("dmobile").innerHTML = json.mobile;
        document.getElementById("currentPassword").innerHTML = json.password;

        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {

            let lineOne;
            let lineTwo;
            let addmobile;
            let city;
            let province;
            let country;
            let postalCode;
            let cityId;
            let countryId;
            let provinceId;
            json.addressList.forEach(address => {

                lineOne = address.lineOne;
                lineTwo = address.lineTwo;
                mobile = address.mobile;
                city = address.city.name;
                province = address.city.province.name;
                country = address.city.province.country.name;
                postalCode = address.postalCode;
                // cityId = address.city.id;
                // provinceId = address.province.id;
                // countryId = address.country.id;
            });
            console.log(country);
            document.getElementById("dline1").textContent = lineOne;
            document.getElementById("dline2").textContent = lineTwo;
            document.getElementById("dcity").textContent = city;

            document.getElementById("dprovince").textContent = province;
            document.getElementById("dcountry").textContent = country;
            document.getElementById("dpostal").textContent = postalCode;
            document.getElementById("dmobileaddress").textContent = addmobile;
        }
    }

}

let provinceList;
let cityList;
async function loadAddressData() {

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadAddressData");
    if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (json.status) {
            provinceList = json.provinceList;
            cityList = json.cityList;
            loadSelect("country", json.countryList, "name");
        } else {
            document.getElementById("message").innerHTML = "Something went wrong. Please try again later";

        }
    } else {
        document.getElementById("message").innerHTML = "Product loading failed. Please try again";

    }
}

function loadSelect(selectId, items, property) {
    const select = document.getElementById(selectId);
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[property];
        select.appendChild(option);
    });
}

function loadProvince() {
    const countryId = document.getElementById("country").value;
    const provinceSelect = document.getElementById("province");
    provinceSelect.length = 1;
    provinceList.forEach(item => {
        if (item.country.id === parseInt(countryId)) {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            provinceSelect.appendChild(option);
        }
    });
}

function loadCity() {
    const provinceId = document.getElementById("province").value;
    const citySelect = document.getElementById("city");
    citySelect.length = 1;
    cityList.forEach(item => {
        if (item.province.id === parseInt(provinceId)) {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            citySelect.appendChild(option);
        }
    });
}

async function saveProfileChanges() {

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const currentPassword = document.getElementById("currentPassword").textContent;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    const userDataJSON = JSON.stringify(userDataObject);

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/MyProfile",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: userDataJSON,
            credentials: "include"
        });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {

            getUserData();
        } else {
            document.getElementById("message").innerHTML = json.message;
        }
    } else {
        document.getElementById("message").innerHTML = "Profile details update failed!";
    }
}

async function saveAddressChanges() {
    const country = document.getElementById("country").value;
    const province = document.getElementById("province").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postalcode").value;
    const lineOne = document.getElementById("line1").value;
    const lineTwo = document.getElementById("line2").value;
    const mobile = document.getElementById("mobile").value;

    console.log(city);

    const userDataObject = {
        countryId: country,
        provinceId: province,
        cityId: city,
        postalCode: postalCode,
        lineOne: lineOne,
        lineTwo: lineTwo,
        mobile: mobile
    };

    const userDataJSON = JSON.stringify(userDataObject);
    console.log(userDataJSON);

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadAddressData", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: userDataJSON,
        credentials: "include"
    });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            addressModelClose();
            document.getElementById("country").value="0";
            document.getElementById("province").value ="0";
            document.getElementById("city").value ="0";
            document.getElementById("postalcode").value ="";
            document.getElementById("line1").value ="";
            document.getElementById("line2").value ="";
            document.getElementById("mobile").value ="";
            getUserData();
        } else {
            document.getElementById("messageAddress").textContent = json.message;
        }
    } else {
        document.getElementById("messageAddress").textContent = "Profile details update failed!";
    }
}
