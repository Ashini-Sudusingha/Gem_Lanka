// function repeat() {

//     //const diamondImages = ["pear.png", "oval.png", "marquise.png", "emerald.png", "round.png", "princess.png"];
//   //  const container = document.querySelector(".relative.w-[300px]");

//     diamondImages.forEach((img, i) => {
//         const imageEl = document.createElement("img");
//         imageEl.src = `resources/${img}`;
//         imageEl.className = "absolute w-12 h-12 diamond";
//         imageEl.style.setProperty('--i', i);
//         container.appendChild(imageEl);
//     });
// }
function loadNavBar() {
  fetch("navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById('navBar').innerHTML = html;

      // Wait a short delay to ensure HTML is inserted before accessing elements
      setTimeout(() => {
        console.log("cart loaded");

        const cartButton = document.getElementById('cart-button');
        const cartDropdownContainer = document.getElementById('cart-icon-container');
        const cartDropdownContent = document.getElementById('cart-dropdown-content');
        const closeCartButton = document.getElementById('close-cart-button');
        const cartItemsList = document.getElementById('cart-items-list');
        const cartItemCountSpan = document.getElementById('cart-item-count');
        const cartHeaderItemCountSpan = document.getElementById('cart-header-item-count');
        const cartTotalSpan = document.getElementById('cart-total');

        // ✅ Check if all required elements exist
        if (!cartButton || !cartDropdownContainer || !closeCartButton || !cartItemsList || !cartItemCountSpan || !cartHeaderItemCountSpan || !cartTotalSpan) {
          console.warn("Some cart elements not found.");
          return;
        }

        // Function to calculate and update total
        function updateCartTotal() {
          let total = 0;
          document.querySelectorAll('#cart-items-list > div').forEach(itemElement => {
            const price = parseFloat(itemElement.dataset.price);
            const quantity = parseInt(itemElement.querySelector('.item-quantity').textContent);
            total += price * quantity;
          });
          cartTotalSpan.textContent = total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          updateCartItemCount();
        }

        // Function to update item count in header
        function updateCartItemCount() {
          const itemCount = document.querySelectorAll('#cart-items-list > div').length;
          cartItemCountSpan.textContent = itemCount;
          cartHeaderItemCountSpan.textContent = `(${itemCount} items)`;
        }

        // Toggle cart dropdown visibility
        cartButton.addEventListener('click', function (event) {
          event.stopPropagation();
          cartDropdownContainer.classList.toggle('active');
        });

        // Close cart dropdown when clicking outside
        document.addEventListener('click', function (event) {
          if (!cartDropdownContainer.contains(event.target) && cartDropdownContainer.classList.contains('active')) {
            cartDropdownContainer.classList.remove('active');
          }
        });

        // Close button inside the dropdown
        closeCartButton.addEventListener('click', function () {
          cartDropdownContainer.classList.remove('active');
        });

        // Event delegation for quantity change and remove buttons
        cartItemsList.addEventListener('click', function (event) {
          const target = event.target;
          const itemElement = target.closest('[data-item-id]');
          if (!itemElement) return;

          const quantitySpan = itemElement.querySelector('.item-quantity');
          let currentQuantity = parseInt(quantitySpan.textContent);

          if (target.closest('.quantity-plus')) {
            currentQuantity++;
            quantitySpan.textContent = currentQuantity;
            updateCartTotal();
          } else if (target.closest('.quantity-minus')) {
            if (currentQuantity > 1) {
              currentQuantity--;
              quantitySpan.textContent = currentQuantity;
              updateCartTotal();
            } else {
              itemElement.remove();
              updateCartTotal();
            }
          } else if (target.closest('.remove-item')) {
            itemElement.remove();
            updateCartTotal();
          }
        });

        // Initial total calculation
        updateCartTotal();

      }, 0); // Delay of 0–10ms ensures DOM updates apply
    })
    .catch(err => {
      document.getElementById('navBar').innerHTML = `<p class="text-red-600">Error loading page.</p>`;
      console.error("Failed to load nav-bar:", err);
    });
}



function searchAnimation() {
    const searchInput = document.getElementById('searchInput');
    const searchContainer = searchInput.parentElement;
    const searchIcon = searchContainer.querySelector('svg');

    searchInput.addEventListener('focus', () => {
        searchContainer.classList.add('w-64', 'bg-[#460809]');
        searchContainer.classList.remove('w-48');
        searchInput.classList.remove('border-[#930003]');
        searchInput.classList.add('border-[#930003]');
        searchIcon.classList.add('text-blue-[#930003]');
        searchIcon.classList.remove('text-gray-400');
    });

    searchInput.addEventListener('blur', () => {
        searchContainer.classList.add('w-48');
        searchContainer.classList.remove('w-64', 'bg-white');
        searchInput.classList.add('border-[#930003]');
        searchInput.classList.remove('border-[#930003]');
        searchIcon.classList.add('text-gray-400');
        searchIcon.classList.remove('text-[#930003]');
    });

}

   function loadFooter() {
            fetch("footer.html")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("footer").innerHTML = data;
                })
                .catch(error => {
                    console.error("Footer loading failed:", error);
                });
        }

