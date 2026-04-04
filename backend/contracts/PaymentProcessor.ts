import { Contract } from '@algorandfoundation/tealscript';

export class PaymentProcessor extends Contract {
  admin = GlobalStateKey<Address>();
  registryAppId = GlobalStateKey<AppID>();
  usdcAssetId = GlobalStateKey<AssetID>();

  // invoiceId -> settlement timestamp (double-spend guard)
  invoices = BoxMap<bytes, uint64>({ prefix: 'inv' });

  createApplication(registryAppId: AppID, usdcAssetId: AssetID): void {
    this.admin.value = this.txn.sender;
    this.registryAppId.value = registryAppId;
    this.usdcAssetId.value = usdcAssetId;
  }

  // opt the contract account into USDC ASA
  optInToUsdc(): void {
    assert(this.txn.sender === this.admin.value, 'admin only');

    sendAssetTransfer({
      xferAsset: this.usdcAssetId.value,
      assetReceiver: this.app.address,
      assetAmount: 0,
    });
  }

  /**
   * payer constructs atomic group:
   *   txn[0]: USDC ASA xfer -> this contract
   *   txn[1]: this app call (invoiceId, merchantId, amount)
   */
  processPayment(invoiceId: bytes, merchantId: bytes, amountUsdc: uint64): void {
    assert(!this.invoices(invoiceId).exists, 'invoice already settled');
    assert(amountUsdc > 0, 'amount must be positive');

    // verify USDC xfer in preceding txn
    const xfer = this.txnGroup[this.txn.groupIndex - 1];
    assert(xfer.typeEnum === TransactionType.AssetTransfer, 'expected asset xfer');
    assert(xfer.xferAsset === this.usdcAssetId.value, 'wrong asset');
    assert(xfer.assetReceiver === this.app.address, 'wrong receiver');
    assert(xfer.assetAmount === amountUsdc, 'amount mismatch');

    // resolve merchant address from registry via inner app call
    const merchantAddr = sendMethodCall<[bytes], Address>({
      applicationID: this.registryAppId.value,
      name: 'getMerchantAddress',
      methodArgs: [merchantId],
    });

    // forward USDC to merchant
    sendAssetTransfer({
      xferAsset: this.usdcAssetId.value,
      assetReceiver: merchantAddr,
      assetAmount: amountUsdc,
    });

    // mark invoice settled
    this.invoices(invoiceId).value = globals.latestTimestamp;

    // ARC-28 settlement event: invoiceId|merchantId|amount
    log(concat(invoiceId, concat(merchantId, itob(amountUsdc))));
  }

  isSettled(invoiceId: bytes): boolean {
    return this.invoices(invoiceId).exists;
  }

  getSettledAt(invoiceId: bytes): uint64 {
    assert(this.invoices(invoiceId).exists, 'invoice not found');
    return this.invoices(invoiceId).value;
  }
}
