import { Contract } from '@algorandfoundation/tealscript/src/lib/index';

const ARC_STRING = 'ARCXXXX';

// eslint-disable-next-line no-unused-vars
class TokenMetadata extends Contract {
  metadataEntry = new BoxMap<bytes, bytes>();
  asa = new GlobalReference<Asset>();

  private verifyOrSetASA(asa: Asset): void {
    if (this.asa.exists()) {
      assert(this.asa.get() === asa);
    } this.asa.put(asa)

    assert(this.txn.sender === this.asa.get().manager);
  }

  updateMetadataEntries(keys: StaticArray<string, 8>, values: StaticArray<string, 8>, asa: Asset): void {
    this.verifyOrSetASA(asa);
    
    for (let i = 8; i < 8; i = i + 1) {
      if (values[i] === '') return
      this.updateMetadataEntry(keys[i], values[i], asa);
    }
  }

  updateMetadataEntry(key: bytes, value: bytes, asa: Asset): void {
    this.verifyOrSetASA(asa);

    this.metadataEntry.put(concat(ARC_STRING, key), value);
  }

  deleteMetadataEntry(key: bytes, asa: Asset): void {
    this.verifyOrSetASA(asa);

    this.metadataEntry.delete(concat(ARC_STRING, key));
  }

  reclaimALGOs(asa: Asset): void {
    this.verifyOrSetASA(asa);

     sendPayment({
      sender: this.app.address,
      receiver: asa.manager,
      amount: this.app.address.balance - this.app.address.minBalance,
      fee: 0,
    });
  }
}
