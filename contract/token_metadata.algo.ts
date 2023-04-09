import { Contract } from '@algorandfoundation/tealscript/src/lib/index';

const ARC_STRING = 'ARCXXXX';
const MAX_ITERATIONS = 4;

// eslint-disable-next-line no-unused-vars
class TokenMetadata extends Contract {
  metadataEntry = new BoxMap<bytes, bytes>();

  asa = new GlobalReference<Asset>();

  private getKey(asa: Asset, key: bytes): bytes {
    return ARC_STRING + itob(asa) + key;
  }

  private auth(asa: Asset): void {
    assert(this.txn.sender === asa.manager);
  }

  private updateMetadataEntry(key: bytes, value: bytes, asa: Asset): void {
    this.auth(asa);

    this.metadataEntry.put(this.getKey(asa, key), value);
  }

  updateMetadataEntries(
    keys: StaticArray<string, typeof MAX_ITERATIONS>,
    values: StaticArray<string, typeof MAX_ITERATIONS>,
    asa: Asset,
  ): void {
    this.auth(asa);

    for (let i = 0; i < MAX_ITERATIONS; i = i + 1) {
      if (values[i] === '') return;
      this.updateMetadataEntry(keys[i], values[i], asa);
    }
  }

  deleteMetadataEntry(key: bytes, asa: Asset): void {
    this.auth(asa);

    this.metadataEntry.delete(this.getKey(asa, key));
  }
}
