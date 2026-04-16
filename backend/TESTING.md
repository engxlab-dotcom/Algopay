# Payment Processor Tests

**File:** `src/__tests__/payment-processor.test.ts`  
**Runner:** Vitest  
**Run:** `npx vitest run`

---

## What is tested

### `submitOnChainPayment`

Verifies the 3-transaction atomic group sent to Algorand:

| Test | Assertion |
|---|---|
| group composition | 2 `addTransaction` calls + 1 `addMethodCall` |
| fee txn | sender = lsig address, amount = 0, fee = 5000 (covers 3 outer + 2 inner txns) |
| xfer + app call | fee = 0 on both (fee pooling — lsig pays all) |
| xfer target | deployer → ProcessorAddr, asset = USDC testnet ID, correct amount |
| txnId | `txIDs[2]` (app call is index 2) |
| lease | sha256(invoiceId), unique per invoice, 32 bytes |
| blockRound | bigint → number conversion |

### `verifyOnChainPayment`

Calls Indexer `lookupTransactionByID` and checks `confirmedRound`:

| Test | Assertion |
|---|---|
| confirmed | returns `true` when `confirmedRound` present |
| unconfirmed | returns `false` when field missing |
| indexer error | returns `false` (does not throw) |

### `getGasFeeAlgo`

Reads `fee` from Indexer and converts microALGO → ALGO string:

| Test | Assertion |
|---|---|
| fee present | `1000` → `"0.001"` |
| fee missing | returns `"0"` |
| indexer error | returns `"0"` (does not throw) |

---

## Mock patterns used

**`vi.hoisted()`** — algosdk constructors are hoisted before `vi.mock` factories run. All mock functions must be created inside `vi.hoisted()` or they will be `undefined` when the factory executes.

**`vi.fn(function() { return ... })`** — algosdk classes (`AtomicTransactionComposer`, `ABIInterface`, `LogicSigAccount`) are called with `new`. Arrow functions cannot be constructors; use regular function expressions.

**`vi.mock('fs', async (importOriginal) => ...)`** — partial mock: preserve all real `fs` methods, override only `readFileSync` so the lsig TEAL compile path does not hit disk.

**lsig singleton** — `getGasPoolLsig` caches the compiled lsig in module scope. Call `vi.resetModules()` in `beforeEach` to reset it between tests if isolation is needed.
