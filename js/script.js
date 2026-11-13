
/* =========================================
   STACKLY MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".stackly-nav-links a");

// Open and close mobile menu
menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("show");

    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    document.body.classList.toggle("menu-open", isOpen);

});

// Close menu after clicking any navigation link
navItems.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Open navigation menu");

        document.body.classList.remove("menu-open");

    });

});




/* =========================================
   STACKLY FOOTER GSAP ANIMATIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof gsap === "undefined") return;

    gsap.from(".footer-top h2", {
        opacity: 0,
        x: -45,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".stackly-fashion-footer",
            start: "top 85%",
            once: true
        }
    });

    gsap.from(".footer-top p", {
        opacity: 0,
        x: 35,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".stackly-fashion-footer",
            start: "top 85%",
            once: true
        }
    });

    gsap.from(".footer-brand, .footer-column", {
        opacity: 0,
        y: 35,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".footer-main",
            start: "top 90%",
            once: true
        }
    });

    gsap.from(".footer-bottom", {
        opacity: 0,
        y: 15,
        duration: 0.7,
        scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 98%",
            once: true
        }
    });

});



/* =====================================
   STACKLY LOADER CONTROL
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("stacklyLoader");

    if (!loader) return;

    const hideLoader = () => {
        loader.classList.add("loader-hidden");

        setTimeout(() => {
            loader.style.display = "none";
        }, 600);
    };

    // Premium loader duration
    setTimeout(hideLoader, 1800);

    // Safety fallback
    setTimeout(hideLoader, 2200);

});
