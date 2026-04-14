export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const body = await request.json();
    
    // Access your secret key from Cloudflare Environment Variables
    const mySecretKey = env["Chapa-api-Secret key"];

    const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mySecretKey}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: "ETB",
        email: body.email,
        first_name: body.first_name,
        tx_ref: body.tx_ref,
        callback_url: "https://rikashgebeya.com/success",
        customizations: {
          title: "Rikash Gebeya Payment",
          description: "Payment for order " + body.tx_ref
        }
      }),
    });

    const result = await chapaResponse.json();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: "failed", message: error.message }), { status: 500 });
  }
}