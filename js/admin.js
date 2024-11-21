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

// Function to render the Admin Dashboard
const renderAdminDashboard = () => {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Error: The #app element does not exist in the DOM.");
        return;
    }

    fetch("http://localhost:3000/orders")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
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
                        ${order.items.map(item => `
                            <li>${item.productName} x ${item.quantity} ($${item.price})</li>
                        `).join("")}
                    </ul>
                    <p><strong>Total Price:</strong> $${order.totalPrice}</p>
                </div>
            `).join("");

            app.innerHTML = `
                <div class="header">
                    <button class="back-button" onclick="renderLandingPage()">← Back</button>
                    <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
                </div>
                <h1>Admin Dashboard</h1>
                <div class="orders">
                    ${ordersList || "<p>No orders placed yet.</p>"}
                </div>
                <button onclick="toggleStoreStatus()" class="close-store-button">
                    ${storeOpen ? "Close Store" : "Open Store"}
                </button>
            `;
        })
        .catch((error) => {
            app.innerHTML = `
                <div class="header">
                    <button class="back-button" onclick="renderLandingPage()">← Back</button>
                    <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
                </div>
                <h1>Admin Dashboard</h1>
                <p>Error loading orders: ${error.message}</p>
                <button onclick="toggleStoreStatus()" class="close-store-button">
                    ${storeOpen ? "Close Store" : "Open Store"}
                </button>
            `;
        });
};

// Function to toggle store status
const toggleStoreStatus = () => {
    storeOpen = !storeOpen;
    alert(storeOpen ? "Store is now open for users." : "Store is now closed for users.");
    renderAdminDashboard();
};
