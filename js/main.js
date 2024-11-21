// Function to render the Checkout Page
const renderCheckout = () => {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Error: The #app element does not exist in the DOM.");
        return;
    }

    const cartItems = Object.entries(cart).map(([id, quantity]) => {
        const product = products.find((p) => p.id === parseInt(id));
        return `
            <div class="checkout-item">
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p class="quantity">Quantity: ${quantity}</p>
                </div>
                <p class="product-total">Total: $${product.price * quantity}</p>
            </div>
        `;
    });

    const totalPrice = Object.entries(cart).reduce((total, [id, quantity]) => {
        const product = products.find((p) => p.id === parseInt(id));
        return total + product.price * quantity;
    }, 0);

    app.innerHTML = `
        <div class="header">
            <button class="back-button" onclick="renderUserCatalog()">← Back</button>
            <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
        </div>
        <h1>Checkout</h1>
        <div id="checkout-items">
            ${cartItems.join("") || "<p>Your cart is empty.</p>"}
        </div>
        <h2 class="total-amount">Total: $${totalPrice}</h2>
        <form id="checkout-form" class="checkout-form">
            <div class="form-group">
                <label for="payment-method">Payment Method (required):</label>
                <select id="payment-method" required>
                    <option value="" disabled selected>Select a payment method</option>
                    <option value="cash">Cash</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="loyalty-points">Loyalty Points</option>
                    <option value="gift-card">Gift Card</option>
                </select>
            </div>
            <div class="form-group">
                <label for="pickup-time">Pickup Time (required):</label>
                <input type="time" id="pickup-time" required>
            </div>
            <div class="form-group">
                <label for="instructions">Additional Instructions (optional):</label>
                <textarea id="instructions" placeholder="Enter any special instructions here..."></textarea>
            </div>
            <button type="submit" class="checkout-button">Pay</button>
        </form>
    `;

    document.getElementById("checkout-form").addEventListener("submit", (event) => {
        event.preventDefault();
        handlePayment();
    });
};

const handlePayment = () => {
    const paymentMethod = document.getElementById("payment-method").value;
    const pickupTimeInput = document.getElementById("pickup-time").value;
    const instructions = document.getElementById("instructions").value;

    if (!paymentMethod || !pickupTimeInput) {
        alert("Please fill in all required fields!");
        return;
    }

    const currentDate = new Date();
    const [hours, minutes] = pickupTimeInput.split(":");
    const pickupTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(hours),
        parseInt(minutes)
    );

    const orderId = Date.now();
    const lockerNumber = Math.floor(Math.random() * 10) + 1;
    const locations = ["Huss Plaza", "SSE Steps", "SSE Plaza", "Bec Plaza"];
    const location = locations[Math.floor(Math.random() * locations.length)];

    const order = {
        orderId,
        customerName: currentUser,
        items: Object.entries(cart).map(([id, quantity]) => {
            const product = products.find((p) => p.id === parseInt(id));
            return {
                productId: product.id,
                productName: product.name,
                quantity,
                price: product.price,
            };
        }),
        totalPrice: Object.entries(cart).reduce((total, [id, quantity]) => {
            const product = products.find((p) => p.id === parseInt(id));
            return total + product.price * quantity;
        }, 0),
        pickupTime: pickupTime.toISOString(),
        instructions,
        lockerNumber,
        location,
        status: "In Progress",
    };

    fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to save the order.");
            }
            renderConfirmationPage(order);
            cart = {};
        })
        .catch((error) => {
            alert(`Error: ${error.message}`);
        });
};

const renderConfirmationPage = (order) => {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Error: The #app element does not exist in the DOM.");
        return;
    }

    app.innerHTML = `
        <div class="header">
            <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
        </div>
        <h1>Order Placed Successfully!</h1>
        <div class="confirmation-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Customer Name:</strong> ${order.customerName}</p>
            <p><strong>Pickup Time:</strong> ${new Date(order.pickupTime).toLocaleString()}</p>
            <p><strong>Locker Number:</strong> ${order.lockerNumber} (${order.location})</p>
            <p><strong>Special Instructions:</strong> ${order.instructions || "None"}</p>
            <p><strong>Total Price:</strong> $${order.totalPrice}</p>
            <h3>Items:</h3>
            <ul>
                ${order.items.map((item) => `
                    <li>${item.productName} x ${item.quantity} ($${item.price})</li>
                `).join("")}
            </ul>
        </div>
        <div class="qr-container">
            <img src="assets/QR-Code.png" alt="QR Code" class="qr-code">
            <p>Use this code to unlock the locker.</p>
        </div>
        <button onclick="renderLandingPage()" class="checkout-button">Back to Home</button>
    `;
};
