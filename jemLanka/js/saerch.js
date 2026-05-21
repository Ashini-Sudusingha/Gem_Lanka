
const popup = new Notification();
let current_page = 0;

async function loadDataSaerch() {

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadProductData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json)
            loadData("category", json.catList, "type");
            loadData("clarity", json.clarityList, "type");
            loadData("color", json.colorList, "value");
            loadData("shape", json.shapeList, "name");
updateProductView(json);
        } else {
            popup.error({
                message: "Somthing went wrong"
            });
        }
    } else {
        popup.error({
            message: "Somthing went wrong"
        });
    }
}
function loadData(prefix, list, col) {
    const Container = document.getElementById(prefix + "-container");
    Container.innerHTML = "";


    list.forEach(item => {
        let address_card = `    
                 <div class="flex items-center space-x-2">
                        <input type="radio" id='${item.id}' name='${prefix}' value='${item.id}'
                            class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <label for="blue-color" class="flex items-center space-x-2 text-sm font-medium text-gray-300">
                            <span>${item[col]}</span>
                        </label>
                    </div>
  
                `;
        Container.innerHTML += address_card;
    });

}


async function searchProduct(firstResult) {
    console.log("enava")
    const catselected = document.querySelector('input[name="category"]:checked');
    const clarityselected = document.querySelector('input[name="clarity"]:checked');
    const colorselected = document.querySelector('input[name="color"]:checked');
    const shapeselected = document.querySelector('input[name="shape"]:checked');
   const weight = document.getElementById("weightNumber").value;
    const price = document.getElementById("priceNumber").value;

    const sort_value = document.getElementById("st-sort").value;

    const data = {
          firstResult: firstResult,
        catselected: catselected.value,
        clarityselected: clarityselected.value,
        colorselected: colorselected.value,
        shapeselected: shapeselected.value,
        weight: weight,
        price: price,
        sortValue: sort_value
    };

    const dataJSON = JSON.stringify(data);
console.log(dataJSON);
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/SearchProductsHere",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataJSON
        });

    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            updateProductView(json);
            popup.success({
                message: "Product Loading Complete..."
            });
        } else {
            popup.error({
                message: "Somthing went wrong. Please try again later"
            });
        }
    } else {
        popup.error({
            message: "Somthing went wrong. Please try again later"
        });
    }
}

const st_product = document.getElementById("st-product"); // product card parent node
let st_pagination_button = document.getElementById("st-pagination-button");


function updateProductView(json) {
    const product_container = document.getElementById("st-product-container");
    product_container.innerHTML = "";
    console.log(json);
    json.productList.forEach(product => {
        let st_product_clone = st_product.cloneNode(true);// enable child nodes cloning / allow child nodes
        st_product_clone.querySelector("#st-product-a-1").href = "single-product.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-img-1").src = "productImage//" + product.id + "//image1.png";
        st_product_clone.querySelector("#st-product-add-to-cart").addEventListener(
            "click", (e) => {
                addToCart(product.id, 1);
                e.preventDefault();
            });
        st_product_clone.querySelector("#st-product-a-2").href = "single-product.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-title-1").innerHTML = product.title;
        st_product_clone.querySelector("#st-product-price-1").innerHTML ="$"+ new Intl.NumberFormat(
            "en-US",
            { minimumFractionDigits: 1 })
            .format(product.price);
        ;
        //append child
        product_container.appendChild(st_product_clone);
    });

    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";
    let all_product_count =  json.productList.length;
    
    let product_per_page = 8;
    let pages = Math.ceil(all_product_count / product_per_page); // round upper integer 

    //previous-button
    if (current_page !== 0) {
        let st_pagination_button_prev_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_prev_clone.innerHTML = "Prev";
        st_pagination_button_prev_clone.addEventListener(
            "click", (e) => {
                current_page--;
                searchProduct(current_page * product_per_page);
                e.preventDefault();
            });
        st_pagination_container.appendChild(st_pagination_button_prev_clone);
    }
 
    // Pagination
    let pagination_container = document.getElementById("st-pagination-container");
    pagination_container.innerHTML = "";

    let total_products = json.allProductCount;
    let total_pages = Math.ceil(total_products / product_per_page);

    // Prev button
    if (current_page > 0) {
        let prevBtn = createPaginationButton("Prev", () => {
            current_page--;
            searchProduct(current_page * product_per_page);
        });
        pagination_container.appendChild(prevBtn);
    }

    // Number buttons
    for (let i = 0; i < total_pages; i++) {
        let btn = createPaginationButton(i + 1, () => {
            current_page = i;
            searchProduct(current_page * product_per_page);
        }, i === current_page);
        pagination_container.appendChild(btn);
    }

    // Next button
    if (current_page < total_pages - 1) {
        let nextBtn = createPaginationButton("Next", () => {
            current_page++;
            searchProduct(current_page * product_per_page);
        });
        pagination_container.appendChild(nextBtn);
    }
}

function createPaginationButton(text, onClick, isActive = false) {
    let btn = document.createElement("span");
    btn.className = `rounded-lg border border-teal-500 px-4 py-2 cursor-pointer ${
        isActive ? "bg-teal-500 text-white" : "text-gray-700"
    }`;
    btn.innerHTML = text;
    btn.addEventListener("click", onClick);
    return btn;
}

async function addToCart(productId, qty) {
    const popup = new Notification();// link notification js in single-product.html
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/AddToCart?prId=" + productId + "&qty=" + qty);
    if (response.ok) {
        const json = await response.json(); // await response.text();
        if (json.status) {
            popup.success({
                message: json.message
            });
        } else {
            popup.error({
                message: "Something went wrong. Try again"
            });

        }
    } else {
        popup.error({
            message: "Something went wrong. Try again"
        });
    }
}