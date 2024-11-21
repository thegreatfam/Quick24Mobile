// User Page Functionality

// Function to render the User Login Page

const renderUserLoginPage = () => {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Error: The #app element does not exist in the DOM.");
        return;
    }
    app.innerHTML = `
        <div class="header">
            <button class="back-button" onclick="renderLandingPage()">← Back</button>
            <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
        </div>
        <img src="assets/Quick_home.jpg" alt="Quick Home" class="home-logo">
        <img src="assets/frontpage.png" alt="Front Page" class="frontpage-image">
        <h1>User Login</h1>
        <div class="login-form">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password">
            <button onclick="handleUserLogin()">Login</button>
        </div>
    `;
};

// Function to handle User Login
const handleUserLogin = () => {
    const username = document.getElementById("username").value;
    currentUser = username || "Guest";
    renderUserCatalog();
};

// Function to render the User Catalog Page
const renderUserCatalog = () => {
    if (!storeOpen) {
        alert("The store is temporarily closed. Please check back later!");
        renderLandingPage();
        return;
    }

    const app = document.getElementById("app");
    if (!app) {
        console.error("Error: The #app element does not exist in the DOM.");
        return;
    }
    app.innerHTML = `
        <div class="header">
            <button class="back-button" onclick="renderLandingPage()">← Back</button>
            <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
        </div>
        <h1>Store Catalog</h1>
        <div id="catalog" class="grid-container"></div>
        <button onclick="renderCheckout()" class="checkout-button">Proceed to Checkout</button>
    `;

    fetch("data/catalog.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((loadedProducts) => {
            products = loadedProducts;
            const catalog = document.getElementById("catalog");
            if (!catalog) {
                console.error("Error: Catalog element (#catalog) does not exist in the DOM.");
                return;
            }
            if (products.length === 0) {
                catalog.innerHTML = "<p>No products available at the moment.</p>";
            } else {
                catalog.innerHTML = products.map((product) => `
                    <div class="product">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Price: $${product.price}</p>
                        <div class="quantity-controls">
                            <button onclick="addToCart(${product.id})">+</button>
                            <span>${cart[product.id] || 0}</span>
                            <button onclick="removeFromCart(${product.id})">-</button>
                        </div>
                    </div>
                `).join("");
            }
        })
        .catch((error) => {
            const catalog = document.getElementById("catalog");
            if (!catalog) {
                console.error("Error: Catalog element (#catalog) does not exist in the DOM.");
                return;
            }
            catalog.innerHTML = `<p>Error loading products: ${error.message}</p>`;
        });
};

// Add item to cart
const addToCart = (productId) => {
    if (!cart[productId]) {
        cart[productId] = 1;
    } else {
        cart[productId] += 1;
    }
    renderUserCatalog();
};

// Remove item from cart
const removeFromCart = (productId) => {
    if (cart[productId] && cart[productId] > 0) {
        cart[productId] -= 1;
        if (cart[productId] === 0) {
            delete cart[productId];
        }
    }
    renderUserCatalog();
};
