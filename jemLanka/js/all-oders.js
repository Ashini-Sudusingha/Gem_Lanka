async function loadProductList() {

    const body = document.getElementById("tableBody");
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/AdminOderSummery", {
        method: "Get",
        credentials: "include"
    });

    // const popup = new Notification();
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json)

            body.innerHTML = "";
            let Total = 0;
            json.orderProductList.forEach(item => {
              
                let row = `<tr>
                            <td class="px-4 py-2 border">#ws1200${item.orders.id}</td>
                            <td class="px-4 py-2 border">${item.product.title}</td>
                            <td class="px-4 py-2 border">${item.qty}</td>
                            <td class="px-4 py-2 border">${item.orders.address.mobile}</td>
                            <td class="px-4 py-2 border">${item.orders.createdAt}</td>
                            <td class="px-4 py-2 border">${item.orderStatus.value}</td>
                        </tr>
            `;

                body.innerHTML += row;
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

function tablepart(){

     $(document).ready(function () {
                    $('#example').DataTable({
                        // Add any customization options here
                    });
                });
}

function printUser() {
  // alert("OK");

  var fullContent = document.body.innerHTML;
  var printarea = document.getElementById("printuserReports").innerHTML;

  document.body.innerHTML = printarea;

  window.print();

  document.body.innerHTML = fullContent;
}