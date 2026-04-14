/**
 * Rikash Gebeya - Payment Logic Handler with Supabase Integration
 * Handles redirection and database logging for Global and Local gateways.
 */

// 1. Supabase Configuration (Get these from your Supabase Project Settings > API)
const SUPABASE_URL = https://yiyeuyxbigiitwfdlzhl.supabase.co;
const SUPABASE_ANON_KEY = 'sb_publishable_JiGXBgIrk1O96LoFUtVMsg_GyKWsEW0';

document.addEventListener('DOMContentLoaded', () => {
    const globalSelect = document.getElementById('global-gateways');
    const localSelect = document.getElementById('local-payments');

    // Listen for Global Payment Selection
    if (globalSelect) {
        globalSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            processPayment(method, 'global');
        });
    }

    // Listen for Local Payment Selection
    if (localSelect) {
        localSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            processPayment(method, 'local');
        });
    }
});

/**
 * Main function to route payment requests and log to database
 * @param {string} method - The value from the dropdown
 * @param {string} category - 'global' or 'local'
 */
async function processPayment(method, category) {
    console.log(`Initializing ${method} payment via ${category} gateway...`);

    // First, log the transaction attempt to Supabase
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                payment_method: method,
                category: category,
                status: 'pending',
                created_at: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('Database logging failed, continuing with redirection:', error);
    }

    // Second, handle the specific redirection logic
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
            window.location.href = `receipt.html?method=${method}&type=bank_transfer`;
            break;

        default:
            window.location.href = `receipt.html?method=${method}`;
    }
}

/**
 * CHAPA API FUNCTION
 */
async function initChapaPayment() {
    console.log("Initializing Chapa payment flow...");
    // For now, redirect to receipt while you set up your server-side keys
    window.location.href = "receipt.html?method=chapa&status=pending";
}

/**
 * TELEBIRR API FUNCTION
 */
function initTelebirrPayment() {
    alert("Redirecting to Telebirr Secure Mobile Portal...");
    window.location.href = "receipt.html?method=telebirr&status=pending";
}