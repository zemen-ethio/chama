/**
 * Rikash Gebeya - Payment Logic Handler with Supabase Integration
 * Path: D:\WEBSITE PROJECT\RikashGebeya\project\Deepseek\main.js
 */

// 1. Supabase Credentials
/**
 * Rikash Gebeya - Secure Payment Logic
 */

// These will be replaced by Cloudflare during deployment
const SUPABASE_URL = typeof process !== 'undefined' ? process.env.SUPABASE_URL : 'https://yiyeuyxbigiitwfdlzhl.supabase.co';
const SUPABASE_ANON_KEY = typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : 'YOUR_FALLBACK_ANON_KEY'; 

// ... rest of your processPayment and handleRedirection functions ...

document.addEventListener('DOMContentLoaded', () => {
    const globalSelect = document.getElementById('global-gateways');
    const localSelect = document.getElementById('local-payments');

    // Listener for International Gateways
    if (globalSelect) {
        globalSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            processPayment(method, 'global');
        });
    }

    // Listener for Ethiopian Banks/Gateways
    if (localSelect) {
        localSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            processPayment(method, 'local');
        });
    }
});

/**
 * Log order attempt to Supabase and handle redirection
 */
async function processPayment(method, type) {
    console.log(`Processing ${method} (${type})...`);

    // Log the transaction to your new Supabase 'orders' table
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                payment_method: method,
                category: type,
                status: 'pending',
                created_at: new Date().toISOString()
            })
        });

        if (response.ok) {
            console.log('✅ Order logged to Supabase dashboard.');
        } else {
            console.error('❌ Failed to log order.');
        }
    } catch (error) {
        console.error('⚠️ Supabase Connection Error:', error);
    }

    // Redirect user to the appropriate gateway or receipt page
    handleRedirection(method);
}

function handleRedirection(method) {
    const bankList = ['cbe', 'awash', 'dashen', 'abyssinia', 'hibret'];

    if (bankList.includes(method)) {
        // Direct to receipt with bank transfer instructions
        window.location.href = `receipt.html?method=${method}&type=bank_transfer`;
    } else if (method === 'telebirr' || method === 'chapa') {
        // Mock redirection for local gateways
        alert(`Redirecting to ${method.toUpperCase()} secure portal...`);
        window.location.href = `receipt.html?method=${method}&status=pending`;
    } else {
        // Default redirection for international gateways
        window.location.href = `receipt.html?method=${method}`;
    }
}