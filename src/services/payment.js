const stripe = require("stripe")(process.env.STRIPE_SECRET);

async function createPaymentIntent(params) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amountToCharge * 100,
      currency: "usd",
      description: `Payment for Order${params.cart_id}`,
      payment_method_types: ["card"],
      shipping: {
        name: `${params.userData.first_name} ${params.userData.last_name}`,
        address: {
          line1: params.userData.address,
          postal_code: params.userData.pincode,
          city: params.userData.city,
          state: params.userData.state,
          country: params.userData.country,
        },
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error("Error creating Payment Intent: ", error.message);
    throw error;
  }
}

async function verifyPayment(paymentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error verifing Payment Intent: ", error.message);
    throw error;
  }
}
module.exports = {
  createPaymentIntent: createPaymentIntent,
  verifyPayment: verifyPayment,
  // Hello
};