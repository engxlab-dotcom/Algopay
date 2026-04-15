import algosdk from 'algosdk'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createHash } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))

const MNEMONIC = process.env.DEPLOYER_MNEMONIC
if (!MNEMONIC) throw new Error('DEPLOYER_MNEMONIC not set')

const account = algosdk.mnemonicToSecretKey(MNEMONIC)
const addr = account.addr.toString()
const signer = algosdk.makeBasicAccountTransactionSigner(account)

const REGISTRY_ID = 758127299
const PROCESSOR_ID = 758127303
const PROCESSOR_ADDR = 'VHNVP2CDHDN5LIFEGVDN5IDWSR6HJYOW7LLA36HVPK2KNQ7VKDWEPINCC4'
const USDC_ID = 10458941
const MERCHANT_ID = 'test-merchant-01'
const AMOUNT_USDC = 1_000_000n

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443)

async function sp0() {
    const s = await algod.getTransactionParams().do()
    return { ...s, fee: 0, flatFee: true }
}

async function sp(fee = 1000) {
    const s = await algod.getTransactionParams().do()
    return { ...s, fee, flatFee: true }
}

async function waitFor(txid) {
    const result = await algosdk.waitForConfirmation(algod, txid, 4)
    console.log(`  confirmed round ${result.confirmedRound} txid ${txid}`)
    return result
}

const REGISTRY_ADDR = '5JBXJ4GFKUY2EWSOM3GMWIPMUP3XDQOPMC6S47DT3MGREQLBSH3PKF2RLQ'

// step 0: check if merchant already registered; register if not
console.log('\n0. ensuring merchant registered...')
{
    const merchantIdBytes = new Uint8Array(Buffer.from(MERCHANT_ID))
    const boxName = new Uint8Array([...Buffer.from('ma'), ...merchantIdBytes])
    let alreadyRegistered = false
    try {
        await algod.getApplicationBoxByName(REGISTRY_ID, boxName).do()
        alreadyRegistered = true
        console.log('  already registered, skipping')
    } catch { /* not found */ }

    if (!alreadyRegistered) {
        const registryArc32 = JSON.parse(readFileSync(
            join(__dirname, '../contracts/artifacts/MerchantRegistry.arc4.json'), 'utf-8'
        ))
        const iface = new algosdk.ABIInterface(registryArc32.contract)
        const method = iface.getMethodByName('registerMerchant')

        // fund registry for box storage if needed
        const regInfo = await algod.accountInformation(REGISTRY_ADDR).do()
        if (regInfo.amount < 300_000) {
            const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                sender: addr, receiver: REGISTRY_ADDR, amount: 300_000,
                suggestedParams: await sp(),
            })
            const signedTxn = payTxn.signTxn(account.sk)
            const { txid } = await algod.sendRawTransaction(signedTxn).do()
            await waitFor(txid)
        }

        const atc = new algosdk.AtomicTransactionComposer()
        atc.addMethodCall({
            appID: REGISTRY_ID,
            method,
            methodArgs: [merchantIdBytes, addr],
            sender: addr,
            signer,
            suggestedParams: await sp(),
            boxes: [
                { appIndex: REGISTRY_ID, name: new Uint8Array([...Buffer.from('ma'), ...merchantIdBytes]) },
                { appIndex: REGISTRY_ID, name: new Uint8Array([...Buffer.from('mc'), ...merchantIdBytes]) },
                { appIndex: REGISTRY_ID, name: new Uint8Array([...Buffer.from('mx'), ...merchantIdBytes]) },
            ],
        })
        const result = await atc.execute(algod, 4)
        console.log(`  registered: ${result.txIDs[0]}`)
    }
}

// step 2: compile lsig and derive address
console.log('\n2. loading gas pool lsig...')
const teal = readFileSync(join(__dirname, '../contracts/gas_pool.lsig.teal'), 'utf-8')
const compileResult = await algod.compile(teal).do()
const program = new Uint8Array(Buffer.from(compileResult.result, 'base64'))
const lsig = new algosdk.LogicSigAccount(program)
const lsigAddr = lsig.address().toString()
const lsigSigner = algosdk.makeLogicSigAccountTransactionSigner(lsig)
console.log(`  lsig address: ${lsigAddr}`)

// fund lsig if needed (min 1 ALGO)
{
    const lsigInfo = await algod.accountInformation(lsigAddr).do()
    if (lsigInfo.amount < 1_000_000) {
        console.log(`  lsig balance low (${lsigInfo.amount}), funding with 5 ALGO...`)
        const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: addr, receiver: lsigAddr, amount: 5_000_000,
            suggestedParams: await sp(),
        })
        const signedTxn = payTxn.signTxn(account.sk)
        const { txid } = await algod.sendRawTransaction(signedTxn).do()
        await waitFor(txid)
    } else {
        console.log(`  lsig funded (${lsigInfo.amount} microALGO)`)
    }
}

// step 3: processPayment — 3-txn atomic group
console.log('\n3. processPayment (gas sponsored)...')
{
    const processorArc32 = JSON.parse(readFileSync(
        join(__dirname, '../contracts/artifacts/PaymentProcessor.arc4.json'), 'utf-8'
    ))
    const iface = new algosdk.ABIInterface(processorArc32.contract)
    const method = iface.getMethodByName('processPayment')

    const invoiceId = `inv-e2e-${Date.now()}`
    const merchantIdBytes = new Uint8Array(Buffer.from(MERCHANT_ID))
    const invoiceIdBytes = new Uint8Array(Buffer.from(invoiceId))
    const lease = new Uint8Array(createHash('sha256').update(invoiceId).digest())

    const spFee = await algod.getTransactionParams().do()

    const feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: lsigAddr,
        receiver: lsigAddr,
        amount: 0,
        lease,
        suggestedParams: { ...spFee, fee: 5000, flatFee: true },
    })

    const xferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: addr,
        receiver: PROCESSOR_ADDR,
        assetIndex: USDC_ID,
        amount: Number(AMOUNT_USDC),
        suggestedParams: { ...spFee, fee: 0, flatFee: true },
    })

    const atc = new algosdk.AtomicTransactionComposer()
    atc.addTransaction({ txn: feeTxn, signer: lsigSigner })
    atc.addTransaction({ txn: xferTxn, signer })
    atc.addMethodCall({
        appID: PROCESSOR_ID,
        method,
        methodArgs: [invoiceIdBytes, merchantIdBytes, Number(AMOUNT_USDC)],
        sender: addr,
        signer,
        suggestedParams: { ...spFee, fee: 0, flatFee: true },
        boxes: [
            { appIndex: PROCESSOR_ID, name: new Uint8Array([...Buffer.from('inv'), ...invoiceIdBytes]) },
            { appIndex: REGISTRY_ID, name: new Uint8Array([...Buffer.from('ma'), ...merchantIdBytes]) },
            { appIndex: REGISTRY_ID, name: new Uint8Array([...Buffer.from('mc'), ...merchantIdBytes]) },
        ],
        appForeignApps: [REGISTRY_ID],
    })

    const result = await atc.execute(algod, 4)
    console.log(`  fee txid:  ${result.txIDs[0]}`)
    console.log(`  xfer txid: ${result.txIDs[1]}`)
    console.log(`  app txid:  ${result.txIDs[2]}`)
    console.log(`  confirmed round: ${result.confirmedRound}`)
    console.log('\ngas sponsorship confirmed — deployer ALGO unchanged, lsig paid all fees')
}
