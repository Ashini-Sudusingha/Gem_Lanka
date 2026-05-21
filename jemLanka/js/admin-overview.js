async function loadProductList() {

    const orderCount = document.getElementById("orderCount");
    const totalSale = document.getElementById("totalSale"); 
     const totalProfite = document.getElementById("totalProfite");
    const itemCount = document.getElementById("itemCount");

    const body = document.getElementById("body");
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/AdminDashboard", {
        method: "Get",
        credentials: "include"
    });

    // const popup = new Notification();
    if (response.ok) {
        const json = await response.json();
        console.log(json)
        if (json.status) {

            body.innerHTML = "";

            json.haveToShippList.forEach(item => {
                
                let productRow = `
        <tr>
        <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
              #ws1200 ${item.orders.id}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                        <img src="productImage/${item.product.id}/image1.png" alt="">
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 ">
                <div class="text-sm text-gray-900">${item.product.title}</div>
                <div class="text-sm text-gray-500">${item.product.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 text-xs font-semibold leading-10 bg-amber-500 rounded-full">
                    ${item.orderStatus.value}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
               ${item.qty}
            </td>
             <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
               ${item.orders.address.lineOne},${item.orders.address.lineTwo}<br>${item.orders.address.mobile}
            </td>
          
        </tr>`;

                body.innerHTML += productRow;
            });
            orderCount.innerHTML =  json.dayOrder;
             totalSale.innerHTML = "$"+ json.total;
             totalProfite.innerHTML = "$"+ json.Totalrev;
             itemCount.innerHTML =  json.itemCount;

        } else {
            // popup.error({
            //     message: json.message
            // });
        }
    } else {
        // popup.error({
        //     message: "Somthing went wrong. Please try again!"
        // });
    }
}