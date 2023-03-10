import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // return res.json({ message: 'Hello world' })

    const { priceId } = req.body

    if (req.method !== 'POST') {
        return res.status(405).json({ error: ' Method not allowed.' })
    }

    if(!priceId) {
        return res.status(400).json({ error: 'Price not found.' })
    }

    // const priceId ='price_1MLVIPAFO072wmUpa45thHVY'

    const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`
    // 4242 4242 4242 4242 número para testar compra no cartão

    const cancelUrl = `${process.env.NEXT_URL}/`

    const checkoutSession = await stripe.checkout.sessions.create({
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: 'payment',
        line_items: [
            {
                price: priceId,
                quantity: 1,
            }
        ]
    })

    return res.status(201).json({
        checkoutUrl:checkoutSession.url,
    })
}

