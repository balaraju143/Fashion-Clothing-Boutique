
/* =========================================
   STACKLY SHOPPING CART
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "stacklyCart";

    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const getProducts = () => window.stacklyProducts || [];

    const saveCart = () => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };

    const getProductId = (card) => {
        const detailsButton = card.querySelector(
            "[data-details], [data-trending-details]"
        );

        if (detailsButton) {
            return Number(
                detailsButton.dataset.details ||
                detailsButton.dataset.trendingDetails
            );
        }

        return Number(card.dataset.productId);
    };

    /* Create cart drawer */
    const drawer = document.createElement("div");
    drawer.id = "stacklyCartDrawer";
    drawer.className = "stackly-side-drawer";

    drawer.innerHTML = `
        <div class="stackly-drawer-header">
            <h3>Shopping Bag <span id="stacklyCartCount">0</span></h3>
            <button type="button" class="stackly-drawer-close" aria-label="Close cart">×</button>
        </div>

        <div class="stackly-drawer-content" id="stacklyCartItems"></div>

        <div class="stackly-cart-footer">
            <div class="stackly-cart-total">
                <span>Subtotal</span>
                <strong id="stacklyCartSubtotal">$0.00</strong>
            </div>
            <button type="button" id="stacklyCheckoutButton">
                Continue to Checkout
            </button>
            <p>Shipping and taxes calculated at checkout.</p>
        </div>
    `;

    document.body.appendChild(drawer);

    /* Floating cart button */
    const cartTrigger = document.createElement("button");
    cartTrigger.type = "button";
    cartTrigger.className = "stackly-floating-cart";
    cartTrigger.innerHTML = `Bag <span id="stacklyCartBadge">0</span>`;
    cartTrigger.setAttribute("aria-label", "Open shopping cart");
  document.body.appendChild(cartTrigger);

    cartTrigger.addEventListener("click", () => {
        drawer.classList.add("open");
        renderCart();
    });

    drawer.querySelector(".stackly-drawer-close")
        .addEventListener("click", () => {
            drawer.classList.remove("open");
        });

    /* Add cart buttons to existing product cards */
    function addCartButtons() {
        document.querySelectorAll(".api-product-card").forEach(card => {
            if (card.querySelector(".stackly-add-cart")) return;

            const id = getProductId(card);
            if (!id) return;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "stackly-add-cart";
            button.dataset.cartProduct = id;
            button.textContent = "Add to Bag";

            const actions = card.querySelector(
                ".api-product-actions, .product-actions"
            );

            if (actions) {
                actions.appendChild(button);
            } else {
                card.appendChild(button);
            }
        });
    }

    /* Add product to cart */
    document.addEventListener("click", event => {
        const addButton = event.target.closest("[data-cart-product]");
        if (!addButton) return;

        const id = Number(addButton.dataset.cartProduct);
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, quantity: 1 });
        }

        saveCart();

        addButton.textContent = "Added to Bag";
        setTimeout(() => {
            addButton.textContent = "Add to Bag";
        }, 1000);
    });

    /* Render cart products */
    function renderCart() {
        const container = document.getElementById("stacklyCartItems");
        if (!container) return;

        const products = getProducts();

        const cartProducts = cart.map(item => ({
            ...item,
            product: products.find(product => product.id === item.id)
        })).filter(item => item.product);

        if (!cartProducts.length) {
            container.innerHTML = `
                <div class="stackly-empty-state">
                    <div>🛍</div>
                    <h4>Your bag is empty</h4>
                    <p>Discover something beautiful for your wardrobe.</p>
                </div>
            `;
        } else {
            container.innerHTML = cartProducts.map(item => `
                <div class="stackly-cart-item">
                    <img src="${item.product.thumbnail}" alt="${item.product.title}">

                    <div class="stackly-cart-info">
                        <h4>${item.product.title}</h4>
                        <p>$${Number(item.product.price).toFixed(2)}</p>

                        <div class="stackly-quantity-controls">
                            <button type="button" data-cart-change="-1"
                                data-cart-id="${item.id}">−</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-cart-change="1"
                                data-cart-id="${item.id}">+</button>
                        </div>

                        <button type="button"
                            class="stackly-remove-cart"
                            data-cart-remove="${item.id}">
                            Remove
                        </button>
                    </div>
                </div>
            `).join("");
        }

        const subtotal = cartProducts.reduce(
            (total, item) =>
                total + Number(item.product.price) * item.quantity,
            0
        );

        const subtotalElement = document.getElementById("stacklyCartSubtotal");
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }

        updateCartCount();
    }

    /* Quantity and remove actions */
    drawer.addEventListener("click", event => {
        const quantityButton = event.target.closest("[data-cart-change]");
        const removeButton = event.target.closest("[data-cart-remove]");

        if (quantityButton) {
            const id = Number(quantityButton.dataset.cartId);
            const change = Number(quantityButton.dataset.cartChange);
            const item = cart.find(product => product.id === id);

            if (item) {
                item.quantity += change;

                if (item.quantity <= 0) {
                    cart = cart.filter(product => product.id !== id);
                }
            }

            saveCart();
        }

        if (removeButton) {
            const id = Number(removeButton.dataset.cartRemove);
            cart = cart.filter(item => item.id !== id);
            saveCart();
        }
    });

    function updateCartCount() {
        const totalQuantity = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        const badge = document.getElementById("stacklyCartBadge");
        const count = document.getElementById("stacklyCartCount");

        if (badge) badge.textContent = totalQuantity;
        if (count) count.textContent = totalQuantity;
    }

    /* Demo checkout confirmation */
    document.getElementById("stacklyCheckoutButton")
        .addEventListener("click", () => {
            if (!cart.length) {
                alert("Your shopping bag is empty.");
                return;
            }

            const confirmed = confirm(
                "This is a demo checkout. Would you like to place this demo order?"
            );

            if (!confirmed) return;

            const order = {
                orderId: "STK" + Date.now(),
                items: cart,
                createdAt: new Date().toISOString()
            };

            const orders = JSON.parse(
                localStorage.getItem("stacklyOrders") || "[]"
            );

            orders.push(order);
            localStorage.setItem("stacklyOrders", JSON.stringify(orders));

            cart = [];
            saveCart();

            alert("Your demo order has been placed successfully!");
            drawer.classList.remove("open");
        });

    /* Detect product cards rendered after API loading */
    const observer = new MutationObserver(addCartButtons);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener("stackly:productsLoaded", () => {
        addCartButtons();
        renderCart();
    });

    addCartButtons();
    updateCartCount();
    renderCart();
});
