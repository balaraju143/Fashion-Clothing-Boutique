
/* ==========================================
   STACKLY FASHION - PRODUCTS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const productGrid = document.getElementById("newArrivalsGrid");
    const loading = document.getElementById("productsLoading");
    const errorBox = document.getElementById("productsError");
    const noProducts = document.getElementById("noProducts");

    const searchInput = document.getElementById("productSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("productSort");

    const loadMoreBtn = document.getElementById("loadMoreProducts");
    const retryBtn = document.getElementById("retryProducts");

    const productModal = document.getElementById("productModal");
    const modalBody = document.getElementById("productModalBody");
    const closeModalBtn = document.getElementById("closeProductModal");

    // Stop if this section is not present on the page
    if (!productGrid) return;

    let allProducts = [];
    let filteredProducts = [];
    let visibleCount = 8;

    // Wishlist storage
    let wishlist = JSON.parse(
        localStorage.getItem("stacklyWishlist") || "[]"
    );

    // Escape API text before inserting into HTML
    function escapeHTML(value = "") {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    // Display API prices in USD
    function formatPrice(price) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(price);
    }

    // Format category names
    function formatCategory(category) {
        return category
            .replace(/-/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    // ======================================
    // FETCH PRODUCTS
    // ======================================

    async function loadProducts() {

        loading.hidden = false;
        errorBox.hidden = true;
        noProducts.hidden = true;

        productGrid.innerHTML = "";
        loadMoreBtn.hidden = true;

        try {

            // Fetch products and categories
            const [products, categories] = await Promise.all([
                fetchProducts(),
                fetchCategories()
            ]);

            allProducts = products;

            // Share the already fetched products with other homepage sections
window.stacklyProducts = allProducts;

window.dispatchEvent(
    new CustomEvent("stackly:productsLoaded", {
        detail: allProducts
    })
);

            // Populate category dropdown
            categoryFilter.innerHTML =
                '<option value="all">All Categories</option>';

            categories.forEach(category => {

                const option = document.createElement("option");

                option.value = category;
                option.textContent = formatCategory(category);

                categoryFilter.appendChild(option);

            });

            visibleCount = 8;

            applyFilters();

        } catch (error) {

            console.error("Loading products failed:", error);

            loading.hidden = true;
            errorBox.hidden = false;

        }
    }


    // ======================================
    // FILTER AND SORT
    // ======================================

    function applyFilters() {

        const searchValue = searchInput.value
            .trim()
            .toLowerCase();

        const selectedCategory = categoryFilter.value;
        const sortValue = sortFilter.value;

        filteredProducts = allProducts.filter(product => {

            const matchesSearch = product.title
                .toLowerCase()
                .includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;

        });

        // Sorting
        if (sortValue === "price-low") {

            filteredProducts.sort((a, b) => a.price - b.price);

        } else if (sortValue === "price-high") {

            filteredProducts.sort((a, b) => b.price - a.price);

        } else if (sortValue === "rating-high") {

            filteredProducts.sort((a, b) => b.rating - a.rating);

        } else if (sortValue === "rating-low") {

            filteredProducts.sort((a, b) => a.rating - b.rating);

        }

        visibleCount = 8;

        renderProducts();

    }


    // ======================================
    // RENDER PRODUCT CARDS
    // ======================================

    function renderProducts() {

        loading.hidden = true;

        const visibleProducts = filteredProducts.slice(
            0,
            visibleCount
        );

        productGrid.innerHTML = "";

        noProducts.hidden = filteredProducts.length !== 0;

        visibleProducts.forEach(product => {

            const isWishlisted = wishlist.includes(product.id);

            const card = document.createElement("article");

            card.className = "api-product-card";

            card.innerHTML = `

                <div class="api-product-image">

                    <img
                        src="${escapeHTML(product.thumbnail)}"
                        alt="${escapeHTML(product.title)}"
                        loading="lazy"
                    >

                    <button
                        class="product-wishlist-btn ${isWishlisted ? "active" : ""}"
                        data-wishlist="${product.id}"
                        aria-label="Toggle wishlist"
                        aria-pressed="${isWishlisted}"
                        type="button"
                    >
                        ${isWishlisted ? "♥" : "♡"}
                    </button>

                </div>

                <div class="product-card-info">

                    <span class="product-category">
                        ${escapeHTML(formatCategory(product.category))}
                    </span>

                    <h3>${escapeHTML(product.title)}</h3>

                    <div class="product-price-rating">

                        <span class="product-price">
                            ${formatPrice(product.price)}
                        </span>

                        <span class="product-rating">
                            ★ ${Number(product.rating).toFixed(1)}
                        </span>

                    </div>

                    <button
                        class="product-details-btn"
                        data-details="${product.id}"
                        type="button"
                    >
                        VIEW DETAILS
                    </button>

                </div>

            `;

            productGrid.appendChild(card);

        });

        loadMoreBtn.hidden =
            visibleCount >= filteredProducts.length;

    }


    // ======================================
    // SEARCH
    // ======================================

    searchInput.addEventListener("input", function () {

        applyFilters();

    });


    // ======================================
    // CATEGORY FILTER
    // ======================================

    categoryFilter.addEventListener("change", function () {

        applyFilters();

    });


    // ======================================
    // SORT PRODUCTS
    // ======================================

    sortFilter.addEventListener("change", function () {

        applyFilters();

    });


    // ======================================
    // LOAD MORE PRODUCTS
    // ======================================

    loadMoreBtn.addEventListener("click", function () {

        visibleCount += 8;

        renderProducts();

    });


    // ======================================
    // WISHLIST
    // ======================================

    function toggleWishlist(productId) {

        if (wishlist.includes(productId)) {

            wishlist = wishlist.filter(id => id !== productId);

        } else {

            wishlist.push(productId);

        }

        localStorage.setItem(
            "stacklyWishlist",
            JSON.stringify(wishlist)
        );

        renderProducts();

    }


    // ======================================
    // PRODUCT DETAILS MODAL
    // ======================================

    function openProductModal(product) {

        modalBody.innerHTML = `

            <div class="product-modal-layout">

                <img
                    src="${escapeHTML(product.thumbnail)}"
                    alt="${escapeHTML(product.title)}"
                >

                <div class="product-modal-info">

                    <span class="product-category">
                        ${escapeHTML(formatCategory(product.category))}
                    </span>

                    <h2>${escapeHTML(product.title)}</h2>

                    <p>${escapeHTML(product.description)}</p>

                    <span class="modal-price">
                        ${formatPrice(product.price)}
                    </span>

                    <p>
                        ★ ${Number(product.rating).toFixed(1)} / 5
                    </p>

                    <p>
                        Brand: ${escapeHTML(product.brand || "N/A")}
                    </p>

                    <p>
                        Availability: ${escapeHTML(product.availabilityStatus || "Check availability")}
                    </p>

                </div>

            </div>

        `;

        productModal.classList.add("show");
        productModal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

    }


    function closeProductModal() {

        productModal.classList.remove("show");
        productModal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

    }


    // Event delegation for product buttons
    productGrid.addEventListener("click", function (event) {

        const wishlistButton = event.target.closest("[data-wishlist]");
        const detailsButton = event.target.closest("[data-details]");

        if (wishlistButton) {

            toggleWishlist(Number(wishlistButton.dataset.wishlist));

        }

        if (detailsButton) {

            const productId = Number(detailsButton.dataset.details);

            const selectedProduct = allProducts.find(
                product => product.id === productId
            );

            if (selectedProduct) {
                openProductModal(selectedProduct);
            }

        }

    });


    closeModalBtn.addEventListener("click", closeProductModal);

    productModal.addEventListener("click", function (event) {

        if (event.target === productModal) {
            closeProductModal();
        }

    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeProductModal();
        }

    });


    // ======================================
    // RETRY API
    // ======================================

    retryBtn.addEventListener("click", loadProducts);


    // ======================================
    // INITIALIZE
    // ======================================

    loadProducts();

});
