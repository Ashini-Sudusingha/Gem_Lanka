async function loadProductList() {

    const body = document.getElementById("body");
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/AdminLoadProductList", {
        method: "Get",
        credentials: "include"
    });

    // const popup = new Notification();
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json)

            body.innerHTML = "";

            json.productList.forEach(item => {
                let statusText = item.active.state === "Active" ? "Active" : "Inactive";
                let statusClasses = item.active.state === "Active"
                    ? "text-green-800 bg-green-100"
                    : "text-red-800 bg-red-100";

                let productRow = `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                        <img src="productImage/${item.id}/image1.png" alt="">
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.title}</div>
                <div class="text-sm text-gray-500">${item.Color.value}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 text-xs font-semibold leading-5 ${statusClasses} rounded-full">
                    ${statusText}
                </span>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
               ${item.cat.type}
            </td>
                    <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
               ${item.qty}
            </td>
             <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
               ${item.price}
            </td>
             <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
               ${item.cost}
            </td>
             <td class="border px-4 py-2">
                                <div class="inline-flex items-center rounded-md shadow-sm">
                                    <button 
                                            class="text-gray-800  text-sm bg-white hover:bg-gray-300 border border-gray-100 rounded-l-lg rounded-tr-lg font-medium px-4 py-2 inline-flex space-x-1 items-center" id='${item.id}' onclick="openModal(this); loadStoreData();">
        <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        </span>
                                        <span class="hidden md:inline-block">Edit</span>
                                    </button>

                                </div>
                            </td>


          
        </tr>`;

                body.innerHTML += productRow;
            });

        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Somthing went wrong. Please try again!"
        });
    }
}

async function openModal(element) {

    let productId = element.id;
    console.log(productId);

    const orderid = {
        productId: productId
    };

    const orderJson = JSON.stringify(orderid);

    const response = await fetch(
        "http://localhost:8080/JemLankaBackEnd/LoadProductUpdateModel",
        {
            method: "POST",
            body: orderJson,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }
    );

    if (response.ok) {//200
        console.log("ok")
        const json = await response.json();
      
        if (json.status) {
             console .log(json)
              document.getElementById("productLoad").innerHTML = "";
            let product_card = `
                   <img src="productImage/${json.oderList.id}/image1.png" 
                  alt="Product Image" 
                    class="w-20 h-20 rounded-lg shadow">
                   `;
          document.getElementById("productLoad").innerHTML += product_card;
            document.getElementById("productName").value = json.oderList.title;
            document.getElementById("category").innerHTML = json.oderList.cat.type;
            document.getElementById("shape").innerHTML = json.oderList.shape.name;
            document.getElementById("calarity").innerHTML = json.oderList.clarity.type;
            document.getElementById("color").innerHTML = json.oderList.Color.value;
            document.getElementById("treatment").innerHTML = json.oderList.treatment.name;
            document.getElementById("description").innerHTML = json.oderList.description;
            document.getElementById("weight").value = json.oderList.weight;
            document.getElementById("length").value = json.oderList.length;
            document.getElementById("hight").value = json.oderList.hight;
            document.getElementById("Width").value = json.oderList.width;
            document.getElementById("stockquantity").innerHTML = json.oderList.qty;
            document.getElementById("status").innerHTML = json.oderList.status.value;
            document.getElementById("sellprice").innerHTML = json.oderList.price;
            document.getElementById("cost").value = json.oderList.cost;

            document.getElementById("Modal1").classList.remove("hidden");
           // document.getElementById("Modal1").value.remove("hidden");

        } else {
            popup.error({
                message: "Somthing went wrong. Please try again!"
            });
        }
    } else {
        if (response.status === 401) {
            window.location = "sign-in.html";
        }

    }

}

async function updateProduct() {

    const productName = document.getElementById("productName").value;
    const categoryId = document.getElementById("category").value;
    const shapeId = document.getElementById("shape").value;
    const calarityId = document.getElementById("calarity").value;
    const colorId = document.getElementById("color").value;
    const treatmentId = document.getElementById("treatment").value;
    const description = document.getElementById("description").value;
    const weight = document.getElementById("weight").value;
    const length = document.getElementById("length").value;
    const Width = document.getElementById("Width").value;
    const hight = document.getElementById("hight").value;
    const stockquantity = document.getElementById("stockquantity").value;
    const states = document.getElementById("status").value;
    const sellprice = document.getElementById("sellprice").value;
    const cost = document.getElementById("cost").value;

    const form = new FormData();
    form.append("productName", productName);
    form.append("categoryId", categoryId);
    form.append("shapeId", shapeId);
    form.append("calarityId", calarityId);
    form.append("colorId", colorId);
    form.append("treatmentId", treatmentId);
    form.append("description", description);
    form.append("weight", weight);
    form.append("length", length);
    form.append("Width", Width);
    form.append("hight", hight);
    form.append("stockquantity", stockquantity);
    form.append("states", states);
    form.append("sellprice", sellprice);
    form.append("cost", cost);

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadProductUpdateModel", {
        method: "PUT",
        body: form
    });

     const notificatoion = document.getElementById("notificatoion");
    notificatoion.innerHTML = "";

    if (response.ok) {
        const json = await response.json();
        if (json.status) {
           
            document.getElementById("message").innerHTML = json.message;

            document.getElementById("productName").value = "";
            document.getElementById("category").value = "0";
            document.getElementById("shape").value = "0";
            document.getElementById("calarity").value = "0";
            document.getElementById("color").value = "0";
            document.getElementById("treatment").value = "0";
            document.getElementById("description").value = "";
            document.getElementById("weight").value = "";
            document.getElementById("length").value = "";
            document.getElementById("Width").value = "";
            document.getElementById("hight").value = "";
            document.getElementById("stockquantity").value = "1";
            document.getElementById("status").value = "0";
            document.getElementById("sellprice").value = "0.00";
            document.getElementById("cost").value = "0.00";


                        let sucessNotification = `
  <div class="fixed inset-0 z-10 overflow-y-auto" id="noty">
            <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="sticky inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div>
                        <div class="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full">
                            <svg viewBox="0 0 64 64" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                fill="#000000">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <defs>
                                        <style>
                                            .cls-1 {
                                                fill: #477e11;
                                            }

                                            .cls-2 {
                                                fill: #ffb300;
                                            }
                                        </style>
                                    </defs>
                                    <title></title>
                                    <path class="cls-1"
                                        d="M41.78,57.13a7.12,7.12,0,0,1-4.2-1.39l-4.32-3.16a3.12,3.12,0,0,0-3.7,0l-4.32,3.16a7.14,7.14,0,0,1-11.31-6.53l.58-5.32a3.11,3.11,0,0,0-1.85-3.2L7.77,38.53a7.13,7.13,0,0,1,0-13.06l4.89-2.16a3.11,3.11,0,0,0,1.85-3.2l-.58-5.32A7.14,7.14,0,0,1,25.24,8.26l4.32,3.16a3.12,3.12,0,0,0,3.7,0l4.32-3.16A7,7,0,0,1,43,7a7.25,7.25,0,0,1,4.75,3.13,2,2,0,1,1-3.34,2.2,3.23,3.23,0,0,0-2.12-1.39,3,3,0,0,0-2.37.57l-4.32,3.16a7.13,7.13,0,0,1-8.43,0l-4.31-3.16a3.13,3.13,0,0,0-5,2.87l.58,5.31A7.11,7.11,0,0,1,14.28,27l-4.9,2.16a3.14,3.14,0,0,0,0,5.74L14.28,37a7.11,7.11,0,0,1,4.21,7.3l-.58,5.31a3.13,3.13,0,0,0,5,2.87l4.31-3.16a7.13,7.13,0,0,1,8.43,0l4.32,3.16a3.13,3.13,0,0,0,5-2.87l-.58-5.31A7.1,7.1,0,0,1,48.54,37l4.9-2.16a3.14,3.14,0,0,0,0-5.74L50.78,28a2,2,0,1,1,1.61-3.66l2.66,1.17a7.13,7.13,0,0,1,0,13.06l-4.89,2.16a3.13,3.13,0,0,0-1.86,3.2l.58,5.32a7,7,0,0,1-3.52,6.95A7.17,7.17,0,0,1,41.78,57.13Z">
                                    </path>
                                    <path class="cls-2"
                                        d="M31.64,39a2,2,0,0,1-1.42-.59l-8.61-8.61A2,2,0,1,1,24.44,27l7.2,7.2L57.08,8.72a2,2,0,0,1,2.82,2.83L33.05,38.4A2,2,0,0,1,31.64,39Z">
                                    </path>
                                </g>
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-5">
                            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                                Succesfully add a new Product
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Thank you your Order
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-6">
                        <button
                            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 sm:text-sm"
                            onclick="notyCloseModel();">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>

           `;
            notificatoion.innerHTML += sucessNotification;


        } else {
            if (json.message === "Please login") {
                window.location = "sign-in.html";
            } else {
                             let sucessNotification = `
    <div class="fixed z-10 inset-0 overflow-y-auto" id="noty">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sticky"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div>
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                        Error
                    </h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">
                        ${json.message}
                        </p>
                    </div>
                </div>
            </div>
            <div class="mt-5 sm:mt-6">
                <button
                    class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                    onclick="closeModal()">
                    OK
                </button>
            </div>
        </div>
    </div>
</div>
           `;
            }
        }
    } else {

    }
}

  function closeModal() {

        document.getElementById("Modal1").classList.add("hidden");

    }

    function printUser() {
  // alert("OK");

  var fullContent = document.body.innerHTML;
  var printarea = document.getElementById("printuserReports").innerHTML;

  document.body.innerHTML = printarea;

  window.print();

  document.body.innerHTML = fullContent;
}