async function loadUserOrders() {
    const addressContainer = document.getElementById("orderContainer");
    addressContainer.innerHTML = "";

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/UserOderTracking",
        {
            method: "GET",
            credentials: "include"
        }

    );

    if (response.ok) {//200

        const json = await response.json();
        console.log(json)
        if (json.status) {

            json.oderList.forEach(item => {
                const createdAt = new Date(item.createdAt); // convert string to Date object

                // Add 7 days
                const newDate = new Date(createdAt);
                newDate.setDate(newDate.getDate() + 7);

                // Format as needed, for example yyyy-mm-dd
                const year = newDate.getFullYear();
                const month = String(newDate.getMonth() + 1).padStart(2, '0'); // months 0-11
                const day = String(newDate.getDate()).padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}`;
                console.log(formattedDate);
                let order_card = `    
                 <div class="p-6 bg-white border border-gray-200 rounded-lg  shadow-md">
                <!--oder card start-->
                <div class="flex flex-col items-start justify-between mb-4 space-y-2 sm:flex-row sm:items-center sm:space-y-0 ">
                    <div class="flex items-center">
                        <span class="mr-2 text-lg font-semibold text-gray-900">Order ID: #FWB000128${item.id}</span>
                        <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">Pre-order</span>
                    </div>
                    <div class="flex space-x-2">
                        
                          <button class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 bg-amber-400" id='${item.id}' onclick="markedDeliverd(this);">Order Deliverd</button>
                        <button class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100" id='${item.id}'  onclick="openModal(this);">Order details</button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 gap-4 mb-4 text-sm text-gray-700 md:grid-cols-3">
                    <div>
                        <span class="font-medium">Order date:</span> ${item.createdAt}
                    </div>
                    <div>
                        <span class="font-medium">Email:</span> ${item.address.user.email}
                    </div>
                    <div class="flex items-center">
                        <span class="mr-1 font-medium">Payment method:</span>
                        <svg class="w-5 h-5 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zm0 2v8h16V8H4zm2 2h2v2H6v-2zm4 0h8v2h-8v-2z"></path></svg>
                        Credit card
                    </div>
                </div>
                <div class="flex items-center p-3 text-sm text-blue-600 bg-gray-100 rounded-md">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Expected delivery ${formattedDate}
                </div>
            </div>`;
                addressContainer.innerHTML += order_card;

            });
        } else {
            // popup.error({
            //   message:
            alert("Something went wrong! Try again shortly");
            //  });
        }
    } else {
        // if (response.status === 401) {
        //     window.location = "sign-in.html";
        // }
    }
}

async function openModal(element) {

    let orderId = element.id;
    console.log(orderId);

    const orderid = {
        orderId: orderId
    };

    const orderJson = JSON.stringify(orderid);

    const response = await fetch(
        "http://localhost:8080/JemLankaBackEnd/UserOrderProductTracking",
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
            console.log(json);
            const addressContainer = document.getElementById("productLoad");
            addressContainer.innerHTML = "";

            json.oderList.forEach(item => {

                let total = 0;
                let subtotal = 0;
                let qty = 0;
                let cost = 0;

                total = item.qty * item.product.price;
                subtotal += total;
                qty += item.qty;


                let product_card = `
                   <img src="productImage/${item.product.id}/image1.png" 
                  alt="Product Image" 
                    class="w-20 h-20 rounded-lg shadow">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800" id="title">Wireless Headphones</h3>
                        <p class="text-sm text-gray-500" id="details">Noise Cancelling, Bluetooth 5.0</p>
                    </div>`;
                addressContainer.innerHTML += product_card;
                document.getElementById("title").innerHTML = `${item.product.title}`;
                document.getElementById("details").innerHTML = `${item.product.price}` * `${item.qty}`;
                document.getElementById("total").innerHTML = "$" + subtotal;
                document.getElementById("Subtotal").innerHTML = "$" + subtotal + 20;
                document.getElementById("orderModal").classList.remove("hidden");
            });
console.log("enava")

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

function closeModal() {

    document.getElementById("orderModal").classList.add("hidden");

}



async function markedDeliverd(element) {

    let orderId = element.id;
    console.log(orderId);

    const orderid = {
        orderId: orderId
    };

    const orderJson = JSON.stringify(orderid);

    const response = await fetch(
        "http://localhost:8080/JemLankaBackEnd/UserOrderProductTracking",
        {
            method: "PUT",
            body: orderJson,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }
    );


    const notificatoion = document.getElementById("notificatoion");
    notificatoion.innerHTML = "";

    if (response.ok) {//200
        console.log("ok")
        const json = await response.json();
        if (json.status) {


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
                            Succesfull
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

                  let sucessNotification = `
    <div class="fixed z-10 inset-0 overflow-y-auto" id="noty">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="sticky inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
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
                            There was an error processing your request.
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
            notificatoion.innerHTML += sucessNotification;
            
        }
    } else {
        if (response.status === 401) {
            window.location = "sign-in.html";
        }
    }
}
