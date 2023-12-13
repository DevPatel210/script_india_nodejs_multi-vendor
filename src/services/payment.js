const stripe = require('stripe')(process.env.STRIPE_SECRET);

async function createPaymentIntent(params) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: params.amountToCharge * 100,
        currency: 'usd', 
        description: `Payment for Order${params.cart_id}`, 
        payment_method_types: ['card'],
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error creating Payment Intent: ', error.message);
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
  verifyPayment: verifyPayment
}