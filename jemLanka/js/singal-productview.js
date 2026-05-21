const popup = new Notification();
const successM = document.getElementById("successMessage");
const susstype = document.getElementById("successtype");
async function loadData() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        console.log(productId);
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/LoadSingalProduct?id=" + productId);
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log(json);
                //   single-product-images
                document.getElementById("image1").src = " productImage\\" + json.product.id + "\\image1.png";
                document.getElementById("image2").src = "productImage\\" + json.product.id + "\\image2.png";
                document.getElementById("image3").src = "productImage\\" + json.product.id + "\\image3.png";
                document.getElementById("thumb-image1").src = "productImage\\" + json.product.id + "\\image3.png";
                //thub-image
                const thumbnails = document.querySelectorAll("#image1, #image2, #image3");

                // The main preview image
                const mainImage = document.getElementById("thumb-image1");

                thumbnails.forEach(thumbnail => {
                    thumbnail.addEventListener("click", () => {
                        // Change main image's src to clicked thumbnail's src
                        mainImage.src = thumbnail.src;
                    });
                });
                //   single-product-images-end

                document.getElementById("product-title").innerHTML = json.product.title;
                document.getElementById("published-on").innerHTML = json.product.created_at;
                document.getElementById("product-price").innerHTML = "$" + new Intl.NumberFormat(
                    "en-US",
                    { minimumFractionDigits: 2 })
                    .format(json.product.price);
                document.getElementById("cat-background").innerHTML = json.product.cat.type;
                document.getElementById("qty").innerHTML = "the last" + " " + json.product.qty + " " + "product";

                // product-color
                document.getElementById("color").innerHTML = json.product.Color.value;

                //product-storage
                console.log(json.product.weight);
                document.getElementById("product-weight").innerHTML = json.product.weight + " " + "ct";
                //product-description
                document.getElementById("description").innerHTML = json.product.description;

                //spesification 
                document.getElementById("list1").innerHTML = "Category:" + " " + json.product.cat.type;
                document.getElementById("list2").innerHTML = "Shape: " + "" + json.product.shape.name;
                document.getElementById("list3").innerHTML = "Color:" + " " + json.product.Color.value;
                document.getElementById("list4").innerHTML = "Weight::" + " " + json.product.weight + "ct";
                document.getElementById("list5").innerHTML = "Width::" + " " + json.product.width + "cm";
                document.getElementById("list6").innerHTML = "Height::" + " " + json.product.hight + "cm";
                document.getElementById("list7").innerHTML = "Length::" + " " + json.product.length + "cm";
                document.getElementById("list8").innerHTML = "Clarity::" + " " + json.product.clarity.type + "cm";
                document.getElementById("list9").innerHTML = "Treatment:" + " " + json.product.treatment.name + "cm";

                //add-to-cart-main-button
                const addToCartMain = document.getElementById("add-to-cart-main");
                addToCartMain.addEventListener(
                    "click", (e) => {
                        addToCart(json.product.id, document.getElementById("add-to-cart-qty").value);
                        e.preventDefault();
                    });
                //add-to-cart-main-button-end

                //similer-products
                let similer_product_main = document.getElementById("smiler-product-main");
                let productHtml = document.getElementById("similer-product");
                similer_product_main.innerHTML = "";
                json.productList.forEach(item => {
                    let productCloneHtml = productHtml.cloneNode(true);
                    productCloneHtml.querySelector("#similer-product-a1").href = "single-product.html?id=" + item.id;
                    productCloneHtml.querySelector("#similer-product-image").src = "productImage\\" + item.id + "\\image1.png";
                    productCloneHtml.querySelector("#simler-product-add-to-cart").addEventListener(
                        "click", (e) => {
                            addToCart(item.id, 1);
                            e.preventDefault();
                        });
                    productCloneHtml.querySelector("#similer-product-a2").href = "single-product.html?id=" + item.id;
                    productCloneHtml.querySelector("#similer-product-title").innerHTML = item.title;
                    productCloneHtml.querySelector("#similer-product-price").innerHTML = "$" + new Intl.NumberFormat(
                        "en-US",
                        { minimumFractionDigits: 2 })
                        .format(item.price);
                    ;

                    // append the clone code
                    similer_product_main.appendChild(productCloneHtml);

                });
                //similer-products-end

                // $('.recent-product-activation').slick({
                //     infinite: true,
                //     slidesToShow: 4,
                //     slidesToScroll: 4,
                //     arrows: true,
                //     dots: false,
                //     prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                //     nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                //     responsive: [{
                //         breakpoint: 1199,
                //         settings: {
                //             slidesToShow: 3,
                //             slidesToScroll: 3
                //         }
                //     },
                //     {
                //         breakpoint: 991,
                //         settings: {
                //             slidesToShow: 2,
                //             slidesToScroll: 2
                //         }
                //     },
                //     {
                //         breakpoint: 479,
                //         settings: {
                //             slidesToShow: 1,
                //             slidesToScroll: 1
                //         }
                //     }
                //     ]
                // });
            } else {
                // console.log("Home ekata redirect venava status eka false nisa")
                window.location = "index.html";
            }
        } else {

            // console.log("Home ekata redirect venava json ekak nethi nisa")
            window.location = "index.html";
        }
    }
}

async function addToCart(productId, qty) {
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/AddToCart?prId=" + productId + "&qty=" + qty,
        {
            method: "GET",
            credentials: "include"
        }
    );
    if (response.ok) {
        const json = await response.json(); // await response.text();
        if (json.status) {
            alert(json.message);
        } else {
            alert(json.message);

        }
    } else {
        popup.error({
            message: "Something went wrong. Try again"
        });
    }
}
