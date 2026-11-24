async function loadStoreData() {
    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadProductData");
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                loadSelect("category", json.catList, "type", "Select Gem Variety");
                loadSelect("shape", json.shapeList, "name", "Select Shape");
                loadSelect("calarity", json.clarityList, "type", "Select Clarity Grade");
                loadSelect("color", json.colorList, "value", "Select Color");
                loadSelect("treatment", json.treatmentList, "name", "Select Treatment");
                loadSelect("status", json.statesList, "value", "Select Status");
                if (json.countryList) {
                    loadSelect("originId", json.countryList, "name", "Select Origin (e.g. Sri Lanka)");
                    // Default to Sri Lanka if available
                    const originSelect = document.getElementById("originId");
                    for (let opt of originSelect.options) {
                        if (opt.text.toLowerCase().includes("sri lanka")) {
                            opt.selected = true;
                            break;
                        }
                    }
                }
            } else {
                showStatus(json.message || "Failed to load product metadata", false);
            }
        }
    } catch (err) {
        console.error("Error loading product form metadata:", err);
    }
}

function loadSelect(selectId, items, property, placeholder) {
    const select = document.getElementById(selectId);
    if (!select) return;
    if (!items || !Array.isArray(items) || items.length === 0) return;
    select.innerHTML = `<option value="0" selected>${placeholder}</option>`;
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        let text = item[property];
        if (text === "Ovel") text = "Oval";
        if (text === "Heat-teatment") text = "Heat Treated";
        if (text === "Out-Off stock") text = "Out of Stock";
        option.textContent = text;
        select.appendChild(option);
    });
}

function calculatePricePerCarat() {
    const weight = parseFloat(document.getElementById("weight").value);
    const totalPrice = parseFloat(document.getElementById("sellprice").value);
    const pricePerCaratEl = document.getElementById("pricePerCarat");

    if (!isNaN(weight) && weight > 0 && !isNaN(totalPrice) && totalPrice > 0) {
        pricePerCaratEl.value = (totalPrice / weight).toFixed(2);
    } else {
        pricePerCaratEl.value = "";
    }
}

function showStatus(message, isSuccess = false) {
    const el = document.getElementById("statusMessage");
    if (!el) return;
    el.textContent = message;
    el.className = `jl-alert ${isSuccess ? 'jl-alert-success' : 'jl-alert-danger'}`;
    el.style.display = "block";
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function saveProduct() {
    const productName = document.getElementById("productName").value.trim();
    const categoryId = document.getElementById("category").value;
    const originId = document.getElementById("originId").value;
    const shapeId = document.getElementById("shape").value;
    const cutStyle = document.getElementById("cutStyle").value;
    const calarityId = document.getElementById("calarity").value;
    const colorId = document.getElementById("color").value;
    const treatmentId = document.getElementById("treatment").value;
    const description = document.getElementById("description").value.trim();
    const weight = document.getElementById("weight").value.trim();
    const length = document.getElementById("length").value.trim();
    const Width = document.getElementById("Width").value.trim();
    const hight = document.getElementById("hight").value.trim();
    const stockquantity = document.getElementById("stockquantity").value.trim();
    const states = document.getElementById("status").value;
    const sellprice = document.getElementById("sellprice").value.trim();
    const cost = document.getElementById("cost").value.trim();
    const pricePerCarat = document.getElementById("pricePerCarat").value.trim();

    // Lab & Certification
    const labName = document.getElementById("labName").value;
    const certNumber = document.getElementById("certNumber").value.trim();
    const certUrl = document.getElementById("certUrl").value.trim();
    const videoUrl = document.getElementById("videoUrl").value.trim();

    const image1 = document.getElementById("img1").files[0];
    const image2 = document.getElementById("img2").files[0];
    const image3 = document.getElementById("img3").files[0];
    const certImage = document.getElementById("certImage") ? document.getElementById("certImage").files[0] : null;

    // Client-side validations
    if (!productName) {
        showStatus("Gemstone Title is required!", false);
        return;
    }
    if (categoryId === "0") {
        showStatus("Please select a Gemstone Category / Variety!", false);
        return;
    }
    if (originId === "0") {
        showStatus("Please select the Gemstone Origin / Mining Country!", false);
        return;
    }
    if (shapeId === "0") {
        showStatus("Please select a Gemstone Shape!", false);
        return;
    }
    if (calarityId === "0") {
        showStatus("Please select Clarity Grade!", false);
        return;
    }
    if (colorId === "0") {
        showStatus("Please select Gemstone Color!", false);
        return;
    }
    if (treatmentId === "0") {
        showStatus("Please select Enhancement / Treatment!", false);
        return;
    }
    if (!weight || parseFloat(weight) <= 0) {
        showStatus("Please enter a valid Carat Weight greater than 0!", false);
        return;
    }
    if (!length || !Width || !hight) {
        showStatus("Please enter all 3 dimensions (Length, Width, Depth in mm)!", false);
        return;
    }
    if (!sellprice || parseFloat(sellprice) <= 0) {
        showStatus("Please enter a valid Selling Price!", false);
        return;
    }
    if (!image1) {
        showStatus("Primary Product Image (Table View) is required!", false);
        return;
    }

    const form = new FormData();
    form.append("productName", productName);
    form.append("categoryId", categoryId);
    form.append("originId", originId);
    form.append("shapeId", shapeId);
    form.append("cutStyle", cutStyle);
    form.append("calarityId", calarityId);
    form.append("colorId", colorId);
    form.append("treatmentId", treatmentId);
    form.append("description", description);
    form.append("weight", weight);
    form.append("length", length);
    form.append("Width", Width);
    form.append("hight", hight);
    form.append("stockquantity", stockquantity || "1");
    form.append("states", states || "1");
    form.append("sellprice", sellprice);
    form.append("cost", cost || "0.0");
    form.append("pricePerCarat", pricePerCarat || "");

    form.append("labName", labName);
    form.append("certNumber", certNumber);
    form.append("certUrl", certUrl);
    form.append("videoUrl", videoUrl);

    form.append("image1", image1);
    if (image2) form.append("image2", image2);
    if (image3) form.append("image3", image3);
    if (certImage) form.append("certImage", certImage);

    const submitBtn = document.getElementById("submitProductBtn");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Publishing Gemstone...`;
    }

    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/SaveProduct", {
            method: "POST",
            body: form,
            credentials: "include"
        });

        const json = await response.json();
        if (response.ok && json.status) {
            showStatus(json.message || "Gemstone published successfully!", true);
            document.getElementById("addProductForm").reset();
            document.getElementById("pricePerCarat").value = "";
        } else {
            showStatus(json.message || "Failed to publish gemstone product.", false);
        }
    } catch (err) {
        console.error("Save product error:", err);
        showStatus("An unexpected network error occurred while publishing gemstone.", false);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-gem"></i> Publish Gemstone to Marketplace`;
        }
    }
}
