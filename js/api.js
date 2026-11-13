
/* ==========================================
   STACKLY FASHION - DUMMYJSON API
========================================== */

const API_BASE_URL = "https://dummyjson.com";

// Fetch all products
async function fetchProducts() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products?limit=100`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch products");
        }

        const data = await response.json();

        if (!Array.isArray(data.products)) {
            throw new Error("Invalid product data received");
        }

        console.log("Products loaded:", data.products.length);

        return data.products;

    } catch (error) {
        console.error("Product API Error:", error);
        throw error;
    }
}


// Fetch all categories
async function fetchCategories() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products/category-list`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch categories");
        }

        const categories = await response.json();

        return categories;

    } catch (error) {
        console.error("Category API Error:", error);
        throw error;
    }
}


// Search products
async function searchProducts(query) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Product search failed");
        }

        const data = await response.json();

        return data.products;

    } catch (error) {
        console.error("Search API Error:", error);
        throw error;
    }
}


// Fetch products by category
async function fetchProductsByCategory(category) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch category products");
        }

        const data = await response.json();

        return data.products;

    } catch (error) {
        console.error("Category filter Error:", error);
        throw error;
    }
}


// Fetch single product details
async function fetchProductDetails(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products/${id}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch product details");
        }

        return await response.json();

    } catch (error) {
        console.error("Product Details Error:", error);
        throw error;
    }
}
