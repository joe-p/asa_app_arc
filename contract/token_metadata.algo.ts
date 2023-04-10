import { Contract } from '@algorandfoundation/tealscript/src/lib/index';

const ARC_STRING = 'ARCXXXX';
const MAX_ITERATIONS = 4;
const TESTNET_APP = 180675275;
type METADATA_ENTRY = StaticArray<string, typeof MAX_ITERATIONS>

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
    keys: METADATA_ENTRY,
    values: METADATA_ENTRY,
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

class Minter extends Contract {
  mint(
    total: uint64,
    decimals: uint64,
    unitName: string,
    assetName: string,
    clawback: Address,
    reserve: Address,
    freeze: Address,
    defaultFrozen: uint64,
    app: Application,
  ): Asset {
    const asa = sendAssetCreation({
      fee: 0,
      configAssetURL: itob(app),
      configAssetTotal: total,
      configAssetDecimals: decimals,
      configAssetManager: this.app.address,
      configAssetUnitName: unitName,
      configAssetName: assetName,
      configAssetClawback: clawback,
      configAssetReserve: reserve,
      configAssetFreeze: freeze,
      configAssetDefaultFrozen: defaultFrozen,
    });

    const lastTxn = this.txnGroup[globals.groupSize - 1];

    assert(lastTxn.applicationID === this.app);
    assert(lastTxn.applicationArgs[0] === method('setManager(address,appl)void'));

    return asa;
  }

  addMetadata(
    appCall: AppCallTxn,
    keys: METADATA_ENTRY,
    values: METADATA_ENTRY,
  ): Asset {
    assert(appCall.applicationID === this.app);
    const asa = Asset.fromIndex(btoi(extract3(appCall.lastLog, 4, 8)));

    sendMethodCall<[METADATA_ENTRY, METADATA_ENTRY, Asset], void>({
      fee: 0,
      name: 'updateMetadataEntries',
      methodArgs: [keys, values, asa],
      onCompletion: 'NoOp',
    });

    return asa;
  }

  setManager(manager: Address, appCall: AppCallTxn): void {
    const asa = Asset.fromIndex(btoi(extract3(appCall.lastLog, 4, 8)));

    sendAssetConfig({
      fee: 0,
      configAsset: asa,
      configAssetManager: manager,
    });
  }
}
