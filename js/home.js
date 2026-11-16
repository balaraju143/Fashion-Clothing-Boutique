

/* ==========================================
   STACKLY FASHION HERO - GSAP ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Check GSAP availability
    if (typeof gsap === "undefined") {
        console.error("GSAP library not loaded!");
        return;
    }

    // Register GSAP
    gsap.registerPlugin();

    // Main animation timeline
    const heroTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    /* ======================================
       LEFT SIDE CONTENT REVEAL
    ====================================== */

    heroTimeline.fromTo(
        ".fashion-brand-name",
        {
            x: -70,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            clearProps: "transform"
        }
    );

    heroTimeline.fromTo(
        ".fashion-hero-text h1",
        {
            x: -80,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1.1,
            clearProps: "transform"
        },
        "-=0.55"
    );

    heroTimeline.fromTo(
        ".hero-description",
        {
            x: -55,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 0.9,
            clearProps: "transform"
        },
        "-=0.65"
    );

    heroTimeline.fromTo(
        ".hero-button-wrap",
        {
            x: -45,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 0.9,
            clearProps: "transform"
        },
        "-=0.55"
    );


    /* ======================================
       THREE BENEFITS REVEAL
    ====================================== */

    const benefits = gsap.utils.toArray(".hero-benefit");

    if (benefits.length) {

        heroTimeline.fromTo(
            benefits,
            {
                x: -45,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                clearProps: "transform"
            },
            "-=0.3"
        );

        // Make dividers visible too
        heroTimeline.fromTo(
            ".benefit-divider",
            {
                opacity: 0,
                scaleY: 0.3
            },
            {
                opacity: 1,
                scaleY: 1,
                duration: 0.5,
                stagger: 0.2,
                clearProps: "transform"
            },
            "<"
        );
    }


    /* ======================================
       RIGHT IMAGE BOTTOM TO TOP REVEAL
    ====================================== */

    heroTimeline.fromTo(
        ".fashion-hero-image-wrap",
        {
            y: 120,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            clearProps: "transform"
        },
        "-=1.2"
    );

});





/* ==========================================
   FEATURED CATEGORIES - GSAP ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    if (typeof gsap === "undefined") {
        console.error("GSAP is not loaded!");
        return;
    }

    gsap.registerPlugin();

    const categoryTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".stackly-categories-section",
            start: "top 80%",
            once: true
        },
        defaults: {
            ease: "power3.out"
        }
    });

    // Subtitle reveal
    categoryTimeline.fromTo(
        ".categories-subtitle",
        {
            y: 25,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.7
        }
    );

    // Heading reveal
    categoryTimeline.fromTo(
        ".categories-heading h2",
        {
            y: 45,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.9
        },
        "-=0.35"
    );

    // Description reveal
    categoryTimeline.fromTo(
        ".categories-heading p",
        {
            y: 30,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8
        },
        "-=0.5"
    );

    // Category cards bottom-to-top reveal
    categoryTimeline.fromTo(
        ".category-card",
        {
            y: 85,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.18,
            clearProps: "transform"
        },
        "-=0.25"
    );

    // Bottom text reveal
    categoryTimeline.fromTo(
        ".categories-bottom",
        {
            y: 25,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.7
        }
    );

});





/* ==========================================
   STACKLY TRENDING PRODUCTS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const trendingGrid = document.getElementById(
        "trendingProductsGrid"
    );

    const trendingLoading = document.getElementById(
        "trendingLoading"
    );

    const trendingError = document.getElementById(
        "trendingError"
    );

    if (!trendingGrid) return;


    // Fashion-related DummyJSON categories
    const fashionCategories = [
        "mens-shirts",
        "mens-shoes",
        "mens-watches",
        "womens-dresses",
        "womens-shoes",
        "womens-bags",
        "womens-jewellery",
        "sunglasses",
        "tops"
    ];


    // Escape API values before inserting into HTML
    function escapeTrendingHTML(value = "") {

        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);

    }


    // Format prices in USD
    function trendingPrice(price) {

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(price);

    }


    // Format category
    function trendingCategory(category) {

        return category
            .replace(/-/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

    }


    // Get wishlist from LocalStorage
    function getTrendingWishlist() {

        try {

            const saved = JSON.parse(
                localStorage.getItem("stacklyWishlist") || "[]"
            );

            return Array.isArray(saved) ? saved : [];

        } catch (error) {

            return [];

        }

    }


    // Render trending products
    function renderTrendingProducts(products) {

        trendingLoading.hidden = true;
        trendingError.hidden = true;

        trendingGrid.innerHTML = "";


        if (!products.length) {

            trendingGrid.innerHTML =
                "<p>No trending products available.</p>";

            return;

        }


        products.forEach(product => {

            const wishlist = getTrendingWishlist();

            const isWishlisted = wishlist.includes(product.id);

            const card = document.createElement("article");

            card.className = "api-product-card";


            card.innerHTML = `

                <div class="api-product-image">

                    <img
                        src="${escapeTrendingHTML(product.thumbnail)}"
                        alt="${escapeTrendingHTML(product.title)}"
                        loading="lazy"
                    >

                    <button
                        type="button"
                        class="product-wishlist-btn ${isWishlisted ? "active" : ""}"
                        data-trending-wishlist="${product.id}"
                        aria-label="Toggle wishlist"
                        aria-pressed="${isWishlisted}"
                    >
                        ${isWishlisted ? "♥" : "♡"}
                    </button>

                </div>


                <div class="product-card-info">

                    <span class="product-category">
                        ${escapeTrendingHTML(
                            trendingCategory(product.category)
                        )}
                    </span>

                    <h3>
                        ${escapeTrendingHTML(product.title)}
                    </h3>

                    <div class="product-price-rating">

                        <span class="product-price">
                            ${trendingPrice(product.price)}
                        </span>

                        <span class="product-rating">
                            ★ ${Number(product.rating).toFixed(1)}
                        </span>

                    </div>

                    <button
                        type="button"
                        class="product-details-btn"
                        data-trending-details="${product.id}"
                    >
                        VIEW DETAILS
                    </button>

                </div>

            `;


            trendingGrid.appendChild(card);

        });

        animateTrendingCards();

    }


    // ======================================
    // GSAP ANIMATION
    // ======================================

    function animateTrendingCards() {

        if (typeof gsap === "undefined") return;

        gsap.fromTo(
            trendingGrid.querySelectorAll(".api-product-card"),
            {
                y: 45,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                clearProps: "transform"
            }
        );

    }


    // ======================================
    // RECEIVE SHARED API PRODUCTS
    // ======================================

    function loadTrendingProducts(products) {

        if (!Array.isArray(products)) {

            trendingLoading.hidden = true;
            trendingError.hidden = false;

            return;

        }


        // Only fashion-related products
        let fashionProducts = products.filter(product =>
            fashionCategories.includes(product.category)
        );


        // If fashion categories are unavailable,
        // use highest-rated products as fallback.
        if (!fashionProducts.length) {

            fashionProducts = [...products];

        }


        // Sort by highest rating
        const trendingProducts = [...fashionProducts]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);


        renderTrendingProducts(trendingProducts);

    }


    // Listen for products loaded by products.js
    window.addEventListener(
        "stackly:productsLoaded",
        function (event) {

            loadTrendingProducts(event.detail);

        }
    );


    // Support if products were loaded before this listener
    if (Array.isArray(window.stacklyProducts)) {

        loadTrendingProducts(window.stacklyProducts);

    } else {

        trendingLoading.hidden = false;

    }


    // ======================================
    // WISHLIST BUTTON
    // ======================================

    trendingGrid.addEventListener("click", function (event) {

        const wishlistButton = event.target.closest(
            "[data-trending-wishlist]"
        );

        if (!wishlistButton) return;


        const productId = Number(
            wishlistButton.dataset.trendingWishlist
        );


        let wishlist = getTrendingWishlist();


        if (wishlist.includes(productId)) {

            wishlist = wishlist.filter(id => id !== productId);

        } else {

            wishlist.push(productId);

        }


        localStorage.setItem(
            "stacklyWishlist",
            JSON.stringify(wishlist)
        );


        // Update all trending heart icons
        trendingGrid
            .querySelectorAll("[data-trending-wishlist]")
            .forEach(button => {

                const id = Number(button.dataset.trendingWishlist);

                const active = wishlist.includes(id);

                button.classList.toggle("active", active);

                button.setAttribute("aria-pressed", String(active));

                button.textContent = active ? "♥" : "♡";

            });

    });


    // ======================================
    // PRODUCT DETAILS MODAL
    // ======================================

    trendingGrid.addEventListener("click", function (event) {

        const detailsButton = event.target.closest(
            "[data-trending-details]"
        );

        if (!detailsButton) return;


        const productId = Number(
            detailsButton.dataset.trendingDetails
        );


        const products = window.stacklyProducts || [];

        const product = products.find(
            item => item.id === productId
        );


        if (!product) return;


        // Reuse New Arrivals modal
        const modal = document.getElementById("productModal");

        const modalBody = document.getElementById(
            "productModalBody"
        );


        if (!modal || !modalBody) return;


        modalBody.innerHTML = `

            <div class="product-modal-layout">

                <img
                    src="${escapeTrendingHTML(product.thumbnail)}"
                    alt="${escapeTrendingHTML(product.title)}"
                >

                <div class="product-modal-info">

                    <span class="product-category">
                        ${escapeTrendingHTML(
                            trendingCategory(product.category)
                        )}
                    </span>

                    <h2>
                        ${escapeTrendingHTML(product.title)}
                    </h2>

                    <p>
                        ${escapeTrendingHTML(product.description)}
                    </p>

                    <span class="modal-price">
                        ${trendingPrice(product.price)}
                    </span>

                    <p>
                        ★ ${Number(product.rating).toFixed(1)} / 5
                    </p>

                    <p>
                        Brand: ${escapeTrendingHTML(product.brand || "N/A")}
                    </p>

                </div>

            </div>

        `;


        modal.classList.add("show");

        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

    });


});



/* =========================================
   STACKLY CUSTOMER TESTIMONIAL SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const track = document.getElementById("testimonialsTrack");
    const nextBtn = document.getElementById("testimonialNext");
    const prevBtn = document.getElementById("testimonialPrev");
    const currentText = document.getElementById("testimonialCurrent");
    const totalText = document.getElementById("testimonialTotal");
    const slider = document.querySelector(".testimonials-slider");

    if (!track || !slider) return;

    const originalCards = Array.from(track.children);
    const totalCards = originalCards.length;

    if (totalCards === 0) return;

    let visibleCards = 3;
    let currentIndex = 0;
    let autoSlide = null;
    let isAnimating = false;
    let resizeTimer = null;

    const slideDuration = 750;
    const autoSlideDelay = 3500;

    /* =====================================
       RESPONSIVE CARD COUNT
    ===================================== */

    function getVisibleCards() {
        return window.innerWidth <= 600 ? 1 : 3;
    }

    /* =====================================
       GET CARD WIDTH AND GAP
    ===================================== */

    function getSlideWidth() {

        const card = track.querySelector(".testimonial-card");

        if (!card) return 0;

        const gap = parseFloat(
            window.getComputedStyle(track).gap
        ) || 0;

        return card.getBoundingClientRect().width + gap;
    }

    /* =====================================
       BUILD INFINITE SLIDER
    ===================================== */

    function buildSlider() {

        visibleCards = getVisibleCards();

        const beforeClones = originalCards
            .slice(-visibleCards)
            .map(card => card.cloneNode(true));

        const afterClones = originalCards
            .slice(0, visibleCards)
            .map(card => card.cloneNode(true));

        track.replaceChildren(
            ...beforeClones,
            ...originalCards,
            ...afterClones
        );

        currentIndex = visibleCards;
        isAnimating = false;

        track.style.transition = "none";

        updateSliderPosition();
        updatePagination();

        requestAnimationFrame(() => {
            track.style.transition = `transform ${slideDuration}ms ease`;
        });
    }

    /* =====================================
       UPDATE SLIDER POSITION
    ===================================== */

    function updateSliderPosition() {

        const slideWidth = getSlideWidth();

        track.style.transform =
            `translate3d(-${currentIndex * slideWidth}px, 0, 0)`;
    }

    /* =====================================
       PAGINATION COUNTER
    ===================================== */

    function updatePagination() {

        const activeNumber =
            ((currentIndex - visibleCards) % totalCards + totalCards)
            % totalCards + 1;

        if (currentText) {
            currentText.textContent =
                String(activeNumber).padStart(2, "0");
        }

        if (totalText) {
            totalText.textContent =
                String(totalCards).padStart(2, "0");
        }
    }

    /* =====================================
       MOVE SLIDER
    ===================================== */

    function moveSlider(direction) {

        if (isAnimating) return;

        isAnimating = true;

        currentIndex += direction;

        track.style.transition =
            `transform ${slideDuration}ms ease`;

        updateSliderPosition();
        updatePagination();
    }

    /* =====================================
       INFINITE LOOP TRANSITION
    ===================================== */

    track.addEventListener("transitionend", event => {

        if (
            event.target !== track ||
            event.propertyName !== "transform"
        ) return;

        if (currentIndex >= visibleCards + totalCards) {

            currentIndex = visibleCards;

            track.style.transition = "none";
            updateSliderPosition();
        }

        if (currentIndex < visibleCards) {

            currentIndex = visibleCards + totalCards - 1;

            track.style.transition = "none";
            updateSliderPosition();
        }

        updatePagination();
        isAnimating = false;

    });

    /* =====================================
       AUTO SLIDE
    ===================================== */

    function stopAutoSlide() {

        if (autoSlide) {
            clearInterval(autoSlide);
            autoSlide = null;
        }
    }

    function startAutoSlide() {

        stopAutoSlide();

        if (window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches) return;

        autoSlide = setInterval(() => {
            moveSlider(1);
        }, autoSlideDelay);
    }

    /* =====================================
       NEXT BUTTON
    ===================================== */

    nextBtn?.addEventListener("click", () => {

        moveSlider(1);

        startAutoSlide();

    });

    /* =====================================
       PREVIOUS BUTTON
    ===================================== */

    prevBtn?.addEventListener("click", () => {

        moveSlider(-1);

        startAutoSlide();

    });

    /* =====================================
       PAUSE ON HOVER
    ===================================== */

    slider.addEventListener("mouseenter", stopAutoSlide);

    slider.addEventListener("mouseleave", startAutoSlide);

    /* Pause when keyboard focus enters slider */
    slider.addEventListener("focusin", stopAutoSlide);

    slider.addEventListener("focusout", event => {

        if (!slider.contains(event.relatedTarget)) {
            startAutoSlide();
        }

    });

    /* =====================================
       MOBILE / DESKTOP RESIZE
    ===================================== */

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            const newVisibleCards = getVisibleCards();

            if (newVisibleCards !== visibleCards) {

                buildSlider();
                startAutoSlide();

            } else {

                track.style.transition = "none";
                updateSliderPosition();

                requestAnimationFrame(() => {
                    track.style.transition =
                        `transform ${slideDuration}ms ease`;
                });

            }

        }, 200);

    });

    /* =====================================
       GSAP SCROLL REVEAL ANIMATIONS
    ===================================== */

    function initTestimonialAnimations() {

        if (typeof gsap === "undefined") return;

        if (
            typeof ScrollTrigger !== "undefined"
        ) {
            gsap.registerPlugin(ScrollTrigger);
        }

        const heading = document.querySelector(
            ".testimonials-heading"
        );

        const eyebrow = document.querySelector(
            ".testimonials-eyebrow"
        );

        const title = document.querySelector(
            ".testimonials-heading h2"
        );

        const description = document.querySelector(
            ".testimonials-heading p"
        );

        const animationOptions = {
            trigger: ".fashion-testimonials",
            start: "top 82%",
            once: true
        };

        if (eyebrow) {
            gsap.from(eyebrow, {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: animationOptions
            });
        }

        if (title) {
            gsap.from(title, {
                opacity: 0,
                y: 35,
                duration: 1,
                delay: 0.15,
                ease: "power3.out",
                scrollTrigger: animationOptions
            });
        }

        if (description) {
            gsap.from(description, {
                opacity: 0,
                y: 25,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out",
                scrollTrigger: animationOptions
            });
        }

        /* Animate original cards only */
        gsap.from(originalCards, {
            opacity: 0,
            y: 45,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".testimonials-viewport",
                start: "top 85%",
                once: true
            }
        });

        gsap.from(".testimonials-controls", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            scrollTrigger: {
                trigger: ".testimonials-controls",
                start: "top 95%",
                once: true
            }
        });
    }

    /* =====================================
       INITIALIZE
    ===================================== */

    buildSlider();

    initTestimonialAnimations();

    startAutoSlide();

});



/* =========================================
   STACKLY NEWSLETTER FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletterEmail");
    const errorMessage = document.getElementById("newsletterError");

    if (!form || !emailInput || !errorMessage) return;

    let errorTimer;

    /* =====================================
       ERROR MESSAGE
    ===================================== */

    function showError(message) {

        clearTimeout(errorTimer);

        errorMessage.textContent = message;
        emailInput.classList.add("newsletter-invalid");

        errorTimer = setTimeout(() => {
            errorMessage.textContent = "";
            emailInput.classList.remove("newsletter-invalid");
        }, 3000);
    }

    /* =====================================
       CLEAR ERROR
    ===================================== */

    function clearError() {

        clearTimeout(errorTimer);

        errorMessage.textContent = "";
        emailInput.classList.remove("newsletter-invalid");
    }

    emailInput.addEventListener("input", clearError);

    /* =====================================
       EMAIL VALIDATION
    ===================================== */

    function validateEmail(email) {

        const emailPattern =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailPattern.test(email);
    }

    /* =====================================
       FORM SUBMISSION
    ===================================== */

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            showError("Please enter your email address.");
            emailInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            showError("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        clearError();

        /* Remember to reset form when user returns */
        sessionStorage.setItem("stacklyNewsletterReset", "true");

        /* Redirect to 404 page */
        window.location.href = "404-page.html";

    });

    /* =====================================
       RESET WHEN RETURNING TO HOME PAGE
    ===================================== */

    function resetNewsletter() {

        if (sessionStorage.getItem("stacklyNewsletterReset") === "true") {

            form.reset();
            clearError();

            sessionStorage.removeItem("stacklyNewsletterReset");

        }
    }

    window.addEventListener("pageshow", resetNewsletter);

    resetNewsletter();

    /* =====================================
       GSAP REVEAL ANIMATION
    ===================================== */

    if (typeof gsap !== "undefined") {

        const newsletterContent = document.querySelector(
            ".newsletter-content"
        );

        const animationSettings = {
            trigger: ".fashion-newsletter",
            start: "top 85%",
            once: true
        };

        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        gsap.fromTo(
            ".newsletter-eyebrow",
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: animationSettings
            }
        );

        gsap.fromTo(
            ".newsletter-content h2",
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                delay: 0.15,
                ease: "power3.out",
                scrollTrigger: animationSettings
            }
        );

        gsap.fromTo(
            ".newsletter-content > p",
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out",
                scrollTrigger: animationSettings
            }
        );

        gsap.fromTo(
            ".newsletter-form",
            {
                opacity: 0,
                y: 25
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.4,
                ease: "power2.out",
                scrollTrigger: animationSettings
            }
        );
    }

});
