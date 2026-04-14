/**
 * Rikash Gebeya - Master Payment Logic
 */

async function startCheckout(orderAmount, customerEmail, customerName) {
    const payBtn = document.getElementById('unified-pay-btn');
    
    try {
        console.log("Initializing secure payment...");
        const transactionRef = "rikash-" + Date.now();

        const response = await fetch("/api/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: orderAmount,
                email: customerEmail,
                first_name: customerName,
                tx_ref: transactionRef
            })
        });

        const result = await response.json();

        if (result.status === "success" && result.data.checkout_url) {
            // Success: Redirect to Chapa (Telebirr/CBE Birr/Bank)
            window.location.href = result.data.checkout_url;
        } else {
            throw new Error(result.message || "Gateway Error");
        }
    } catch (err) {
        console.error("Payment Error:", err);
        alert("Payment initialization failed. Please try again.");
        
        // Reset the button so the user can try again
        if (payBtn) {
            payBtn.disabled = false;
            payBtn.innerText = "Try Payment Again";
            payBtn.style.opacity = "1";
        }
    }
}