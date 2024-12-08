// Admin Page Functionality

// Function to render the Admin Login Page
const renderAdminLoginPage = () => {
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
        <h1>Admin Login</h1>
        <div class="login-form">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password">
            <button onclick="handleAdminLogin()">Login</button>
        </div>
    `;
};

// Function to handle Admin Login
const handleAdminLogin = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin") {
        renderAdminDashboard();
    } else {
        alert("Invalid Admin Credentials!");
    }
};

// Function to render the Admin Dashboard with a hamburger menu
const renderAdminDashboard = () => {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Error: The #app element does not exist in the DOM.");
        return;
    }

    app.innerHTML = `
        <div class="header">
            <button class="hamburger-menu" onclick="toggleMenu()">☰</button>
            <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
        </div>
        <div class="admin-dashboard">
            <div id="sidebar" class="sidebar">
                <button onclick="handleMenuClick('orders')">Previous Orders</button>
                <button onclick="handleMenuClick('inventory')">Manage Inventory</button>
                <button onclick="handleMenuClick('pricing')">Manage Pricing</button>
                <button onclick="toggleStoreStatus()">Close/Open Store</button>
            </div>
            <div id="content" class="content"></div>
        </div>
    `;

    // Automatically load the Previous Orders section
    handleMenuClick('orders');
};


// Function to toggle the sidebar visibility
const toggleMenu = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.display === "none" || !sidebar.style.display) {
        sidebar.style.display = "block"; // Make it visible for the transition
        setTimeout(() => {
            sidebar.classList.add("visible");
        }, 10); // Slight delay to allow transition to occur
    } else {
        sidebar.classList.remove("visible");
        setTimeout(() => {
            sidebar.style.display = "none"; // Hide after transition
        }, 300); // Match the transition duration
    }
};

// Function to close the sidebar and update content
const handleMenuClick = (section) => {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    // Close the sidebar
    sidebar.classList.remove("visible");
    setTimeout(() => {
        sidebar.style.display = "none";
    }, 300);

    // Update the content based on the section
    if (section === "orders") {
        renderOrdersSection(content);
    } else if (section === "inventory") {
        renderInventorySection(content);
    } else if (section === "pricing") {
        renderPricingSection(content); // New Pricing Section
    }
};


// Render the orders section
const renderOrdersSection = (content) => {
    fetch("data/orders.json")
        .then((response) => response.json())
        .then((orders) => {
            const ordersList = orders.map((order) => `
                <div class="order-item">
                    <h3>Order ID: ${order.orderId}</h3>
                    <p><strong>Customer Name:</strong> ${order.customerName}</p>
                    <p><strong>Pickup Time:</strong> ${new Date(order.pickupTime).toLocaleString()}</p>
                    <p><strong>Locker Number:</strong> ${order.lockerNumber} (${order.location})</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Special Instructions:</strong> ${order.instructions || "None"}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                        ${order.items.map((item) => `
                            <li>${item.productName} x ${item.quantity} ($${item.price})</li>
                        `).join("")}
                    </ul>
                    <p><strong>Total Price:</strong> $${order.totalPrice}</p>
                </div>
            `).join("");

            content.innerHTML = `
                <h2>Previous Orders</h2>
                <div class="orders">
                    ${ordersList || "<p>No orders placed yet.</p>"}
                </div>
            `;
        })
        .catch((error) => {
            content.innerHTML = `<p>Error loading orders: ${error.message}</p>`;
        });
};

// Render the inventory section
const renderInventorySection = (content) => {
    fetch("data/catalog.json")
        .then((response) => response.json())
        .then((products) => {
            const inventoryList = products.map((product) => `
                <div class="inventory-item">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Current Stock:</strong> <span id="stock-${product.id}">${product.stock || 0}</span></p>
                    <div class="inventory-controls">
                        <button onclick="updateInventory(${product.id}, 'increase')">+</button>
                        <button onclick="updateInventory(${product.id}, 'decrease')">-</button>
                    </div>
                </div>
            `).join("");

            content.innerHTML = `
                <h2>Manage Inventory</h2>
                <div class="inventory">
                    ${inventoryList}
                </div>
            `;
        })
        .catch((error) => {
            content.innerHTML = `<p>Error loading inventory: ${error.message}</p>`;
        });
};


// Function to update inventory
const updateInventory = (productId, action) => {
    fetch("data/catalog.json")
        .then((response) => response.json())
        .then((products) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return;

            if (action === "increase") {
                product.stock = (product.stock || 0) + 1;
            } else if (action === "decrease" && product.stock > 0) {
                product.stock -= 1;
            }

            // Update the UI
            document.getElementById(`stock-${productId}`).innerText = product.stock;

            // Save changes
            saveInventory(products);
        });
};

// Save inventory updates
const saveInventory = (updatedProducts) => {
    fetch("save_catalog.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProducts),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                alert("Inventory updated successfully!");
            } else {
                alert("Failed to save inventory updates: " + data.message);
            }
        })
        .catch((error) => {
            alert("Error saving inventory updates: " + error.message);
        });
};
// Save catalog updates
const saveCatalog = (updatedProducts) => {
    fetch("save_catalog.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProducts),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                alert("Changes saved successfully!");
            } else {
                alert("Failed to save changes: " + data.message);
            }
        })
        .catch((error) => {
            alert("Error saving changes: " + error.message);
        });
};

// Function to toggle the store status
const toggleStoreStatus = () => {
    storeOpen = !storeOpen;
    alert(storeOpen ? "Store is now open for users." : "Store is now closed for users.");
};

// Render the pricing section
const renderPricingSection = (content) => {
    fetch("data/catalog.json")
        .then((response) => response.json())
        .then((products) => {
            const pricingList = products.map((product) => `
                <div class="pricing-item">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p><strong>Current Price:</strong> $<span id="price-${product.id}">${product.price}</span></p>
                    <div class="pricing-controls">
                        <button onclick="updatePrice(${product.id}, 'increase')">+</button>
                        <button onclick="updatePrice(${product.id}, 'decrease')">-</button>
                    </div>
                </div>
            `).join("");

            content.innerHTML = `
                <h2>Manage Pricing</h2>
                <div class="pricing">
                    ${pricingList}
                </div>
            `;
        })
        .catch((error) => {
            content.innerHTML = `<p>Error loading pricing data: ${error.message}</p>`;
        });
};
// Function to update product prices
const updatePrice = (productId, action) => {
    fetch("data/catalog.json")
        .then((response) => response.json())
        .then((products) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return;

            if (action === "increase") {
                product.price += 1; // Increase price by $1
            } else if (action === "decrease" && product.price > 0) {
                product.price -= 1; // Decrease price by $1
            }

            // Update the UI
            document.getElementById(`price-${productId}`).innerText = product.price;

            // Save changes
            saveCatalog(products);
        });
};
