payhere.onCompleted = function onCompleted(orderId) {
    const popup = new Notification();
    popup.success({
        message: "Payment completed. OrderID:" + orderId
    });
};

// Payment window closed
payhere.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
};

// Error occurred
payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
};


async function loadCheckoutData() {

    const popup = new Notification();
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadCheckOutData",
        {
            method: "GET",
            credentials: "include"
        }

    );
    if (response.ok) {//200
        console.log("ok")
        const json = await response.json();
        if (json.status) {
            console.log(json);
            loadcartData(json);
            getUserAddress(json);
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

function getUserAddress(json) {
    const addressContainer = document.getElementById("addressContainer");
    addressContainer.innerHTML = "";


    json.userAddress.forEach(item => {
        let address_card = `    
                   
                <label class="cursor-pointer">
                  <input type="radio" class="sr-only peer" name="shippingaddress" value='${item.id}' />
                  <div
                    class="max-w-2xl p-5 text-gray-600 transition-all bg-white rounded-md w-72 dark:bg-gray-900 dark:text-gray-300 ring-2 ring-transparent hover:shadow peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2">
                    <div class="flex flex-col gap-1">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">Address</p>
                        <div>
                          <svg class="text-gray-500 dark:text-gray-400" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor"
                              d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                          </svg>
                        </div>
                      </div>
                      <div class="flex items-end justify-between">
                        <p>${item.lineOne}<br>${item.lineTwo}<br> ${item.city.name}, ${item.city.province.name}, ${item.city.province.country.name}<br> ${item.postalCode}</p>
                        
                      </div>
                    </div>
                  </div>
                </label>`;
        addressContainer.innerHTML += address_card;
    });

}

function openEditAddressModelCkeckout() {
    const addressModel = document.getElementById("edit-address-modal");
    addressModel.classList.add("active");

}

function loadcartData(json) {
    let dTotal = document.getElementById("Total");
    let dqty = document.getElementById("qty");
    let dsubtotal = document.getElementById("subtotal");

    cartTable.innerHTML = "";

    json.cartList.forEach(item => {
        let total = 0;
        let subtotal = 0;
        let qty = 0;
        let cost = 0;

        total = item.qty * item.product.price;
        subtotal += total;
        qty += item.qty;
        let cart_row = ` 
          <tr>
                  <td class="whitespace-nowrap py-4 md:w-[384px]">
                    <div class="flex items-center gap-4">
                      <a href="#" class="flex items-center w-10 h-10 aspect-square shrink-0">
                        <img class="w-full h-auto max-h-full "
                          src="productImage/${item.product.id}/image1.png" alt="imac image" alt="imac image" />
                      
                      <a href="#" class="hover:underline">${item.product.title}</a>
                    </div>
                  </td>

                  <td class="p-4 text-base font-normal text-gray-900">${item.qty}</td>

                  <td class="p-4 text-base font-bold text-right text-gray-900 ">$${new Intl.NumberFormat("en-US",
            { minimumFractionDigits: 2 })
                .format(total)}</td>
                </tr>   
              `;
        cost = subtotal + 2 + 20
        cartTable.innerHTML += cart_row;
        dTotal.innerHTML = "$" + `${new Intl.NumberFormat("en-US",
            { minimumFractionDigits: 2 })
            .format(subtotal)}`;
        dqty.innerHTML = qty;
        dsubtotal.innerHTML = "$" + `${new Intl.NumberFormat("en-US",
            { minimumFractionDigits: 2 })
            .format(cost)}`;

    });

}

async function checkout() {
    
    let termscheckbox = document.getElementById("terms-checkbox-2").checked;
    let addressSelected = document.querySelector('input[name="shippingaddress"]:checked');

    let data = {
        termscheckbox: termscheckbox,
        addressSelected: addressSelected.value
       
    };
    let dataJSON = JSON.stringify(data);

    const response = await fetch("http://localhost:8080/JemLankaBackEnd/CheckOut", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: dataJSON,
        credentials: "include"
    });

    const popup = new Notification();
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            // PayHere Process
            payhere.startPayment(json.payhereJson);
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