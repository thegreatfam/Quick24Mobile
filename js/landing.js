// Landing Page Functionality

// Function to render the Landing Page
const renderLandingPage = () => {
    const app = document.getElementById("app");
    if (!app) {
        console.error("Error: The #app element does not exist in the DOM.");
        return;
    }
    app.innerHTML = `
        <div class="header">
            <img src="assets/Qtogo.png" alt="Quick To Go" class="app-logo">
        </div>
        <img src="assets/Quick_home.jpg" alt="Quick Home" class="home-logo">
        <img src="assets/frontpage.png" alt="Front Page" class="frontpage-image">
        <h1>Welcome to Quick 24</h1>
        <div class="button-container">
            <button onclick="renderAdminLoginPage()">Admin Login</button>
            <button onclick="renderUserLoginPage()">User Login</button>
        </div>
    `;
};

document.addEventListener("DOMContentLoaded", () => {
    renderLandingPage();
});
