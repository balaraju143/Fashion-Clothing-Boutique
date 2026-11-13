
/* =========================================
   STACKLY WISHLIST
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const WISHLIST_KEY = "stacklyWishlist";

    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

    const getProducts = () => window.stacklyProducts || [];

    const saveWishlist = () => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        updateWishlistButtons();
        renderWishlist();
    };

    const getProductId = (button) => {
        return Number(
            button.dataset.wishlist ||
            button.dataset.trendingWishlist ||
            button.dataset.details ||
            button.dataset.trendingDetails
        );
    };

    const updateWishlistButtons = () => {
        document.querySelectorAll(
            "[data-wishlist], [data-trending-wishlist]"
        ).forEach(button => {
            const id = getProductId(button);
            const active = wishlist.includes(id);

            button.classList.toggle("active", active);
            button.innerHTML = active ? "♥" : "♡";
            button.setAttribute(
                "aria-label",
                active ? "Remove from wishlist" : "Add to wishlist"
            );
        });

        const count = document.getElementById("stacklyWishlistCount");
        if (count) count.textContent = wishlist.length;
    };

    /* Create Wishlist Drawer */
    const drawer = document.createElement("div");
    drawer.id = "stacklyWishlistDrawer";
    drawer.className = "stackly-side-drawer";

    drawer.innerHTML = `
        <div class="stackly-drawer-header">
            <h3>My Wishlist <span id="stacklyWishlistCount">0</span></h3>
            <button type="button" class="stackly-drawer-close" aria-label="Close wishlist">×</button>
        </div>
        <div class="stackly-drawer-content" id="stacklyWishlistItems"></div>
    `;

    document.body.appendChild(drawer);

    /* Create Floating Wishlist Button */
    const wishlistTrigger = document.createElement("button");
    wishlistTrigger.type = "button";
    wishlistTrigger.className = "stackly-floating-wishlist";
    wishlistTrigger.innerHTML = `♡ <span id="stacklyWishlistBadge">0</span>`;
    wishlistTrigger.setAttribute("aria-label", "Open wishlist");
  document.body.appendChild(wishlistTrigger);

    const closeDrawer = () => drawer.classList.remove("open");

    wishlistTrigger.addEventListener("click", () => {
        drawer.classList.add("open");
        renderWishlist();
    });

    drawer.querySelector(".stackly-drawer-close")
        .addEventListener("click", closeDrawer);

    document.addEventListener("click", (event) => {
        const button = event.target.closest(
            "[data-wishlist], [data-trending-wishlist]"
        );

        if (!button) return;

        const id = getProductId(button);
        if (!id) return;

        if (wishlist.includes(id)) {
            wishlist = wishlist.filter(item => item !== id);
        } else {
            wishlist.push(id);
        }

        saveWishlist();
    });

    function renderWishlist() {
        const container = document.getElementById("stacklyWishlistItems");
        if (!container) return;

        const products = getProducts();
        const savedProducts = wishlist
            .map(id => products.find(product => product.id === id))
            .filter(Boolean);

        const badge = document.getElementById("stacklyWishlistBadge");
        const count = document.getElementById("stacklyWishlistCount");

        if (badge) badge.textContent = wishlist.length;
        if (count) count.textContent = wishlist.length;

        if (!savedProducts.length) {
            container.innerHTML = `
                <div class="stackly-empty-state">
                    <div>♡</div>
                    <h4>Your wishlist is empty</h4>
                    <p>Save your favourite fashion products here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = savedProducts.map(product => `
            <div class="stackly-wishlist-item">
                <img src="${product.thumbnail}" alt="${product.title}">
                <div class="stackly-wishlist-info">
                    <h4>${product.title}</h4>
                    <p>$${Number(product.price).toFixed(2)}</p>
                    <button type="button"
                        class="stackly-remove-wishlist"
                        data-remove-wishlist="${product.id}">
                        Remove
                    </button>
                </div>
            </div>
        `).join("");
    }

    drawer.addEventListener("click", event => {
        const removeButton = event.target.closest("[data-remove-wishlist]");
        if (!removeButton) return;

        const id = Number(removeButton.dataset.removeWishlist);
        wishlist = wishlist.filter(item => item !== id);
        saveWishlist();
    });

    /* Wait for API products if they load after this file */
    document.addEventListener("stackly:productsLoaded", () => {
        updateWishlistButtons();
        renderWishlist();
    });

    updateWishlistButtons();
    renderWishlist();
});
