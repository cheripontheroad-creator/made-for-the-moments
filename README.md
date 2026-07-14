# Made for the Moments — Backend Package

## Replace these files in GitHub

- `api/create-checkout-session.js`
- `order-section.js`
- `package.json`

## Add this new file

- `api/send-order.js`

## Required Vercel environment variables

- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`

Production and Preview are sufficient for sensitive variables.

## What happens after installation

1. Customer completes the order form.
2. Written order details are emailed to `yourmadeforthemoments@gmail.com`.
3. Customer receives a confirmation email.
4. Stripe Checkout opens with the same MFTM order number.

## Important photo limitation

This version emails the selected photo **file names**, not the actual image files.
The next upgrade should upload photos to Vercel Blob, Cloudinary, or another storage
service and include secure links in the order email.

## Test checklist

1. Commit all four files to GitHub.
2. Wait for Vercel deployment status **Ready**.
3. Complete a test order with your email address.
4. Confirm the detailed business order email arrives.
5. Confirm the customer confirmation email arrives.
6. Confirm Stripe Checkout opens.
7. Confirm the same `MFTM-...` order number appears in email and Stripe metadata.
