/**
 * Rikash Gebeya - Payment Logic Handler
 * Handles redirection and API initialization for Global and Local gateways.
 */

document.addEventListener('DOMContentLoaded', () => {
    const globalSelect = document.getElementById('global-gateways');
    const localSelect = document.getElementById('local-payments');

    // 1. Listen for Global Payment Selection
    if (globalSelect) {
        globalSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            processPayment(method, 'global');
        });
    }

    // 2. Listen for Local Payment Selection
    if (localSelect) {
        localSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            processPayment(method, 'local');
        });
    }
});

/**
 * Main function to route payment requests
 * @param {string} method - The value from the dropdown (e.g., 'telebirr', 'stripe')
 * @param {string} type - 'global' or 'local'
 */
function processPayment(method, type) {
    console.log(`Initializing ${method} payment via ${type} gateway...`);

    // Show a loading state or spinner here if desired
    
    switch (method) {
        // --- LOCAL GATEWAYS ---
        case 'telebirr':
            initTelebirrPayment();
            break;
        case 'chapa':
            initChapaPayment();
            break;
        
        // --- GLOBAL GATEWAYS ---
        case 'stripe':
            window.location.href = "https://checkout.stripe.com/pay/your_session_id"; 
            break;
        case 'paypal':
            window.location.href = "https://www.paypal.com/checkoutnow?token=your_token";
            break;

        // --- DIRECT BANK INSTRUCTIONS ---
        case 'cbe':
        case 'awash':
        case 'dashen':
            // Redirect to a page showing your specific bank account details for manual transfer
            window.location.href = `receipt.html?method=${method}&type=bank_transfer`;
            break;

        default:
            // Generic redirection for others
            window.location.href = `receipt.html?method=${method}`;
    }
}

/**
 * CHAPA API FUNCTION
 * Chapa requires a POST request to their initialize endpoint.
 */
async function initChapaPayment() {
    // Note: In a real production environment, this call MUST happen 
    // through your server to hide your Secret Key.
    const paymentData = {
        amount: "100", // This should be dynamic based on the cart
        currency: "ETB",
        email: "customer@example.com",
        first_name: "User",
        tx_ref: "rikash-" + Date.now(), // Unique reference
        callback_url: "https://rikashgebeya.com/verify-payment",
        return_url: "https://rikashgebeya.com/payment-success"
    };

    console.log("Calling Chapa API...", paymentData);
    // Logic: Redirect user to Chapa's hosted checkout page
    // window.location.href = "https://api.chapa.co/v1/transaction/initialize";
}

/**
 * TELEBIRR API FUNCTION
 */
function initTelebirrPayment() {
    alert("Redirecting to Telebirr Secure Mobile Portal...");
    // Telebirr integration typically uses a H5 redirect or a QR code generation API
    window.location.href = "receipt.html?method=telebirr&status=pending";
}