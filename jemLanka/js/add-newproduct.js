
async function loadStoreData() {

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadProductData");
    if (response.ok) {
        const json = await response.json();
        //  console.log(json);
        if (json.status) {
            loadSelect("category", json.catList, "type");
            loadSelect("shape", json.shapeList, "name");
            loadSelect("calarity", json.clarityList, "type");
            loadSelect("color", json.colorList, "value");
            loadSelect("treatment", json.treatmentList, "name");
            loadSelect("treatment", json.treatmentList, "name");
            loadSelect("status", json.statesList, "value");

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

async function saveProduct() {

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


    const image1 = document.getElementById("img1").files[0];
    const image2 = document.getElementById("img2").files[0];
    const image3 = document.getElementById("img3").files[0];

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
    form.append("image1", image1);
    form.append("image2", image2);
    form.append("image3", image3);

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/SaveProduct", {
        method: "POST",
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


            const image1 = document.getElementById("img1").value= "";
            const image2 = document.getElementById("img2").value = "";
            const image3 = document.getElementById("img3").value= "";

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