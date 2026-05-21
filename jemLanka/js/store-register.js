

async function loadStoreData() {

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadStoreData");
    if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (json.status) {
            loadSelect("category", json.bussinessList, "name");
            loadSelect("position", json.positionList, "name");
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



async function storeRegistor() {

    const bussName = document.getElementById("bussName").value;
    const bussemail = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const categoryId = document.getElementById("category").value;
    const positionId = document.getElementById("position").value;
    const password = document.getElementById("password").value;
    const comfirmPassword = document.getElementById("comfirmPassword").value;
     const liseImage = document.getElementById("liseImage").files[0];
    
 
    const form = new FormData();
    form.append("bussName", bussName);
    form.append("bussemail", bussemail);
    form.append("mobile", mobile);
    form.append("categoryId", categoryId);
    form.append("positionId", positionId);
    form.append("password", password);
    form.append("comfirmPassword", comfirmPassword);
    form.append("liseImage", liseImage);

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/CreateStore", {
        method: "POST",
        body: form,
        credentials: "include"
    });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            popup.success({
                message: "New product added successfully"
            });
            document.getElementById("bussName").value="";
            document.getElementById("email").value="";
            document.getElementById("mobile").value="";
            document.getElementById("category").value=0;
            document.getElementById("position").value=0;
            document.getElementById("password").value="";
            document.getElementById("comfirmPassword").value="";
            document.getElementById("liseImage").files[0]="";

        } else {
            if (json.message === "Please login") {
                window.location = "sign-in.html";
            } else {
                popup.error({
                    message: json.message
                });
            }
        }
    } else {

    }
}