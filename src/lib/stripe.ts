import "server-only";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const hasStripeConfig = Boolean(secretKey);

export const stripe = secretKey ? new Stripe(secretKey) : null;
