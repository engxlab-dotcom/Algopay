# Algopay — Full Project Brief

## What is Algopay

Algopay is a universal crypto payment API built for AI agents and enterprise ERP systems like Tally, Zoho, and SAP.
The core problem is that AI agents cannot use traditional bank 2FA or corporate cards. Algopay gives them a single
API they can call natively to make and verify crypto payments across any blockchain, settling in USDC on Algorand.

Target market: Indian enterprise and ERP ecosystem.

---

## Repository Layout

The project lives under algo/ at the root. There are two apps — pay/ which is the existing backend, and merchant/
which is a new app that needs to be built from scratch. The pay/ app handles all blockchain logic, smart contract
interaction, and API routing. The merchant/ app is the web interface merchants use to manage their payments.

---

## algo/pay — What is already built

### Network and client layer

Provides Algorand network clients for both mainnet and testnet using AlgoNode public infrastructure.
Exposes the USDC asset IDs for each network (mainnet: 31566704, testnet: 10458941), and utility functions
to get a node client, indexer client, and higher-level AlgoKit wrapper client.

### Payment request layer

Handles creation of payment requests. A payment request ties together a merchant's Algorand address,
an amount in USD cents, a UUID, a USDC asset ID, an expiry timestamp, and a network. Also provides
unit conversion between USD cents and microUSDC (1 cent = 10,000 microUSDC), and encodes the payment ID
as bytes for inclusion in Algorand transaction notes.

### Validation layer

Validates completed on-chain USDC transactions against a payment request. Performs seven checks in order:
the transaction must exist in the Indexer, must be an asset transfer type, must use the correct USDC asset ID,
must be sent to the merchant's address, must meet the required amount, must carry the correct payment ID in
the note field, and must have been confirmed before the payment expired. Returns a payment proof object
on success, or throws a typed error with a specific error code on any failure.

### Bridge layer

Integrates Allbridge Core SDK to support cross-chain payments. A payer on Ethereum, Base, Solana, Avalanche,
Polygon, Arbitrum, or Optimism can send USDC to an Algorand merchant. The bridge layer fetches a quote
showing the estimated amount that will arrive on Algorand after fees, and produces raw transaction calldata
the payer's wallet signs. A separate status function polls Allbridge to return whether a given bridge
transfer is pending, complete, or failed.

### Smart contract

A Puya ARC4 contract deployed on Algorand that enforces spending guardrails for AI agents. An admin registers
agents with a daily USD spending limit and a vendor whitelist hash. Each time an agent attempts a payment,
the contract checks the daily limit, deducts the spend, and resets the counter every 24 hours automatically.
Returns a boolean indicating whether the spend was approved. A read-only method lets anyone query an agent's
current limit, amount spent today, and last reset time.

### Gas sponsorship

A LogicSig contract that sponsors transaction fees on behalf of agents so they do not need to hold ALGO
to pay for gas.

### What is NOT yet built in algo/pay

Four API route handlers that expose the lib layer over HTTP. These are stateless — they take a JSON request,
call the relevant lib function, and return a JSON response. No database, no auth. The routes cover creating
a payment request, validating a completed transaction, fetching a bridge quote, and polling bridge transfer status.

---

## algo/merchant — What needs to be built from scratch

This is a separate Next.js app. It is the web product merchants (businesses) use to accept USDC payments.
It should use Tailwind CSS for styling, NextAuth.js for authentication, and Supabase as the database.
It communicates with algo/pay exclusively over HTTP.

### Auth and signup

Merchants sign up with their business name, email, password, and their Algorand wallet address — this is
the address where they receive USDC. Passwords are hashed. Sessions are managed via NextAuth credentials provider.
All dashboard routes are protected and redirect to login if unauthenticated.

### Database

Two tables in Supabase. The merchants table stores business name, email, hashed password, and Algorand address.
The payment requests table stores each payment request created by a merchant — the payment ID, amount, network,
expiry, status (pending, confirmed, or expired), and once validated, the transaction ID, confirmation timestamp,
and payer address.

### Dashboard home

Shows the merchant their Algorand address with a copy button, their total USDC received across all confirmed
payments, and a list of their most recent payments.

### Payment request page

The merchant enters an amount in USD. The dashboard calls the pay API to create a payment request using their
saved Algorand address, stores it in Supabase, and displays the payment ID, a QR code encoding the full
payment request, and a copyable payment link to send to the payer.

### Payment history page

A table of all the merchant's payment requests pulled from Supabase. Shows payment ID, amount, status, and
creation date. For pending payments the merchant can paste a transaction ID — the dashboard calls the pay API
to validate it on-chain, and on success updates the record in Supabase to confirmed and displays the proof.

### Bridge tracker page

The merchant enters a source chain, amount, and the payer's wallet address on the source chain. The dashboard
fetches a bridge quote from the pay API and shows the estimated amount that will arrive on Algorand. After the
payer has sent the cross-chain payment, the merchant pastes the source chain transaction ID and the dashboard
polls the pay API every five seconds to show live transfer status with a visual indicator.

---

## Key rules for anyone building on this project

Do not modify anything inside lib/, types/, or contracts/ in algo/pay — those are complete and stable.
All new backend code goes into app/api/ inside algo/pay. All frontend code goes into the new algo/merchant/ app.
The merchant app must never import directly from the pay app — it communicates only over HTTP.
BigInt values from the bridge layer must be serialized as strings in all JSON responses.
Error codes from the validation layer must be passed through as-is to API consumers without remapping.
