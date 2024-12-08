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

// Function to render the User Catalog Page with a Hamburger Menu
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
            <button class="hamburger-menu" onclick="toggleUserMenu()">☰</button>
            <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
        </div>
        <div id="user-sidebar" class="sidebar">
            <button onclick="handleUserMenuClick('storeCatalog')">Store Catalog</button>
            <button onclick="handleUserMenuClick('orderHistory')">Order History</button>
            <button onclick="handleUserMenuClick('paymentWallet')">Payment & Wallet</button>
        </div>
        <div id="user-content" class="content">
            <h1>Store Catalog</h1>
            <div id="catalog" class="grid-container"></div>
            <button onclick="renderCheckout()" class="checkout-button">Proceed to Checkout</button>
        </div>
    `;

    // Call your existing catalog rendering logic
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

// Render the Order History section
const renderOrderHistory = (content) => {
    fetch("data/orders.json")
        .then((response) => response.json())
        .then((orders) => {
            const userOrders = orders.filter((order) => order.customerName === currentUser);
            if (userOrders.length > 0) {
                content.innerHTML = `
                    <h2>Order History</h2>
                    ${userOrders.map((order) => `
                        <div class="order-item">
                            <h3>Order Date: ${new Date(order.pickupTime).toLocaleString()}</h3>
                            <ul>
                                ${order.items.map((item) => `
                                    <li>${item.productName} x ${item.quantity} ($${item.price})</li>
                                `).join("")}
                            </ul>
                            <p><strong>Total Price:</strong> $${order.totalPrice}</p>
                            <button onclick="reorder(${order.orderId})">Reorder</button>
                        </div>
                    `).join("")}
                `;
            } else {
                content.innerHTML = `<h2>Order History</h2><p>No previous orders found.</p>`;
            }
        })
        .catch((error) => {
            content.innerHTML = `<p>Error loading order history: ${error.message}</p>`;
        });
};


// Function to reorder an order
const reorder = (orderId) => {
    fetch("data/orders.json")
        .then((response) => response.json())
        .then((orders) => {
            const order = orders.find((o) => o.orderId === orderId);
            if (order) {
                cart = order.items.reduce((acc, item) => {
                    acc[item.productId] = item.quantity;
                    return acc;
                }, {});
                renderCheckout(); // Call your existing checkout rendering function
            }
        })
        .catch((error) => {
            alert(`Error reordering: ${error.message}`);
        });
};

// Render the Payment & Wallet section
const renderPaymentWallet = (content) => {
    fetch("data/users.json")
        .then((response) => response.json())
        .then((users) => {
            const user = users.find((u) => u.username === currentUser);
            if (user) {
                content.innerHTML = `
                    <h2>Payment & Wallet</h2>
                    <p><strong>Wallet Balance:</strong> $${user.wallet || 0}</p>
                    <h3>Saved Credit Cards</h3>
                    <ul id="credit-card-list">
                        ${user.creditCards.map((card, index) => `
                            <li style="position: relative;">
                                <img src="assets/${card.cardType.toLowerCase()}.png" alt="${card.cardType}" class="card-logo">
                                ${card.cardNumber} (expires in ${card.expiry})
                                <button class="menu-button" onclick="toggleCardMenu(${index})">⋮</button>
                                <div id="card-menu-${index}" class="card-menu">
                                    <button onclick="removeCard(${index})">Remove Card</button>
                                </div>
                            </li>
                        `).join("")}
                    </ul>
                    <button onclick="showAddCardForm()">Add Card</button>
                    <div id="add-card-form" style="display: none;">
                        <h3>Add New Card</h3>
                        <div class="card-preview">
                            <img src="assets/visa.png" alt="Visa" id="card-type-preview">
                            <span id="card-number-preview">**** **** **** ****</span>
                        </div>
                        <label for="card-type">Card Type:</label>
                        <select id="card-type">
                            <option value="Visa">Visa</option>
                            <option value="MasterCard">MasterCard</option>
                        </select>
                        <label for="card-number">Card Number:</label>
                        <input type="text" id="card-number" placeholder="Enter 16-digit card number">
                        <label for="expiry-date">Expiry Date:</label>
                        <input type="text" id="expiry-date" placeholder="MM/YY">
                        <button onclick="addCard()">Add Card</button>
                    </div>
                `;

                // Add event listener for dynamic card type updates
                document.getElementById("card-type").addEventListener("change", (event) => {
                    const cardType = event.target.value.toLowerCase();
                    const previewImage = document.getElementById("card-type-preview");
                    previewImage.src = `assets/${cardType}.png`;
                    previewImage.alt = cardType;
                });

                // Add event listener for live card number preview
                document.getElementById("card-number").addEventListener("input", (event) => {
                    const input = event.target.value;
                    const preview = document.getElementById("card-number-preview");
                    if (input.length > 12) {
                        preview.textContent = `**** **** **** ${input.slice(-4)}`;
                    } else {
                        preview.textContent = "**** **** **** ****";
                    }
                });
            } else {
                content.innerHTML = `<h2>Payment & Wallet</h2><p>No wallet or payment methods found.</p>`;
            }
        })
        .catch((error) => {
            content.innerHTML = `<p>Error loading payment data: ${error.message}</p>`;
        });
};


// Function to toggle the dropdown menu for a card
const toggleCardMenu = (index) => {
    const menu = document.getElementById(`card-menu-${index}`);
    if (menu) {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
};


// Function to show the Add Card form
const showAddCardForm = () => {
    const form = document.getElementById("add-card-form");
    if (form) {
        form.style.display = "block";
    }
};

// Function to add a new card
const addCard = () => {
    const cardType = document.getElementById("card-type").value;
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;

    // Validate inputs
    if (!cardNumber || cardNumber.length !== 16 || !expiryDate) {
        alert("Please enter a valid 16-digit card number and expiry date.");
        return;
    }

    fetch("data/users.json")
        .then((response) => response.json())
        .then((users) => {
            const user = users.find((u) => u.username === currentUser);
            if (user) {
                // Add the new card to the user's credit cards
                user.creditCards.push({
                    cardType,
                    cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
                    expiry: expiryDate
                });

                // Save changes to the users.json file
                saveUsers(users);

                // Refresh the Payment & Wallet section
                const content = document.getElementById("user-content");
                renderPaymentWallet(content);
            } else {
                alert("User not found.");
            }
        })
        .catch((error) => {
            alert(`Error adding card: ${error.message}`);
        });
};


// Function to remove a card
const removeCard = (cardIndex) => {
    fetch("data/users.json")
        .then((response) => response.json())
        .then((users) => {
            const user = users.find((u) => u.username === currentUser);
            if (user) {
                user.creditCards.splice(cardIndex, 1);

                // Save changes to the users.json file
                saveUsers(users);

                // Refresh the Payment & Wallet section
                const content = document.getElementById("user-content");
                renderPaymentWallet(content);
            }
        })
        .catch((error) => {
            alert(`Error removing card: ${error.message}`);
        });
};

// Function to save users.json updates
const saveUsers = (updatedUsers) => {
    fetch("save_users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUsers),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                console.log("Users data saved successfully.");
            } else {
                console.error("Failed to save users data:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error saving users data:", error.message);
        });
};



// Function to handle menu clicks
const handleUserMenuClick = (section) => {
    const sidebar = document.getElementById("user-sidebar");
    const content = document.getElementById("user-content");

    // Close the sidebar
    sidebar.classList.remove("visible");

    // Navigate to the selected section
    if (section === "storeCatalog") {
        // Re-render the Store Catalog within the user-content div
        content.innerHTML = `
            <h1>Store Catalog</h1>
            <div id="catalog" class="grid-container"></div>
            <button onclick="renderCheckout()" class="checkout-button">Proceed to Checkout</button>
        `;

        // Load the catalog
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
    } else if (section === "orderHistory") {
        renderOrderHistory(content);
    } else if (section === "paymentWallet") {
        renderPaymentWallet(content);
    }
};

// Toggle the user sidebar visibility
const toggleUserMenu = () => {
    const sidebar = document.getElementById("user-sidebar");
    sidebar.classList.toggle("visible");
};
