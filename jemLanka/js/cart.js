async function loadCartItems() {
  const popup = new Notification();
  const response = await fetch("http://localhost:8080/JemLankaBackEnd/CartIteamsLoad",
    {
      method: "GET",
      Credential: "include"
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
    if (json.status) {
      const cart_item_container = document.getElementById("cart-item-container");

      cart_item_container.innerHTML = "";

      let subTotal = 0;
      let total = 0;
      let totalQty = 0;
      json.cartItems.forEach(cart => {
        let productSubTotal = cart.product.price * cart.qty;
        total += productSubTotal;
        totalQty += cart.qty;
        let tableData = `  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm md:p-6 font-['Poppins',sans-serif] cart-card"" id="cart-card">
              <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                <a href="#" class="shrink-0 md:order-1">
                  <img class="w-20 h-20"
                     src="productImage/${cart.product.id}/image1.png" alt="imac image" />
                </a>

                <label for="counter-input" class="sr-only">Choose quantity:</label>
                <div class="flex items-center justify-between md:order-3 md:justify-end">
                  <div class="flex items-center">
                    <button type="button" id="decrement-button" data-input-counter-decrement="counter-input-min" onclick="changeQty(this, -1);"
                      class="inline-flex items-center justify-center w-5 h-5 bg-gray-100 border border-gray-300 rounded-md shrink-0 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 quantity-minus">
                      <svg class="h-2.5 w-2.5 text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M1 1h16" />
                      </svg>
                    </button>
                    <input type="number"  id="qty" data-input-counter 
                      class="w-10 text-sm font-medium text-center text-gray-900 bg-transparent border-0 shrink-0 focus:outline-none focus:ring-0 no-spinner quantity"
                      placeholder="" min="1" required value= ${cart.qty} />
                    <button type="button" id="increment-button" data-input-counter-increment="counter-input-high" onclick="changeQty(this, 1);"
                      class="quantity-plus inline-flex items-center justify-center w-5 h-5 bg-gray-100 border border-gray-300 rounded-md shrink-0 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100">
                      <svg class="h-2.5 w-2.5 text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 1v16M1 9h16" />
                      </svg>
                    </button>
                  </div>
                  <div class="text-end md:order-4 md:w-32">
                    <p class="text-base font-bold text-gray-900 item-price subtotal" > $${new Intl.NumberFormat("en-US",
          { minimumFractionDigits: 2 })
            .format(productSubTotal)}</p>
                  </div>
                </div>

                <div class="flex-1 w-full min-w-0 space-y-4 md:order-2 md:max-w-md">
                  <a href="#" class="text-base font-medium text-gray-900 hover:underline"> ${cart.product.title} , ${cart.product.cat.type} , ${cart.product.Color.value},${cart.product.clarity.type} ,${cart.product.weight}ct  </a>

                  <div class="flex items-center gap-4 mt-6">
                    <button type="button"
                      class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline ">
                      <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                      </svg>
                      Add to Favorites
                    </button>

                    <button type="button"
                      class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500" onclick="removeItem(this);">
                      <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18 17.94 6M18 18 6.06 6" />
                      </svg>
                      Remove
                    </button>
                    <p class="text-base font-bold text-gray-900 price" data-price="5" >$${new Intl.NumberFormat("en-US",
              { minimumFractionDigits: 2 })
            .format(cart.product.price)}</p>
                      <p class="text-base font-bold text-gray-900">Qty <span class="qtyproduct"">${cart.product.qty}</span>
                      </p>
                  </div>
                </div>
              </div>
            </div>  `;
        cart_item_container.innerHTML += tableData;

      });
      document.getElementById("order-total-quantity").innerHTML = totalQty;
      document.getElementById("order-total-amount").innerHTML = new Intl.NumberFormat("en-US",
        { minimumFractionDigits: 2 })
        .format(total);
      subTotal = total + 5 + 20;
      document.getElementById("order-total-subamount").innerHTML = new Intl.NumberFormat("en-US",
        { minimumFractionDigits: 2 })
        .format(subTotal);
 document.getElementById("store").innerHTML = "$10";
document.getElementById("ship").innerHTML = "$20";


    } else {
      popup.error({
        message: json.message
      });
      console.log("message")
    }
  } else {
    popup.error({
      message: "Cart Items loading failed..."
    });
  }
}

function changeQty(btn, change) {
  const popup = new Notification();

  const item = btn.closest(".cart-card");
  const qtyEl = item.querySelector(".quantity");
  const qtyE2 = item.querySelector(".qtyproduct");
  console.log(qtyE2);
  console.log(qtyEl);
  let stock = parseInt(qtyE2.textContent.trim(), 10);
  let qty = parseInt(qtyEl.value) + change;

  if (stock > qty) {
    if (qty < 1) qty = 1;
    qtyEl.value = qty;
    updateCart();
  } else {
    popup.error({
      message: "Sorry sold out"
    });
    console.log("message");
  }
}

function removeItem(btn) {
  let cartItem = btn.closest(".cart-card"); // parent cart card div eka hoya ganna
  if (cartItem) {
    cartItem.remove(); // remove the cart item
    updateCart(); // update the cart total
  }
}

function updateCart() {
  let totalQty = 0;
  let totalPrice = 0;
  document.querySelectorAll(".cart-item").forEach(item => {
    const qty = parseInt(item.querySelector(".quantity").value);
    const price = parseFloat(item.querySelector(".price").dataset.price);
    item.querySelector(".subtotal").textContent = `$${(qty * price).toFixed(2)}`;
    totalQty += qty;
    totalPrice += qty * price;
  });
  document.getElementById("order-total-quantity").textContent = totalQty;
  document.getElementById("order-total-amount").textContent = `$${totalPrice.toFixed(2)}`;
}

updateCart();