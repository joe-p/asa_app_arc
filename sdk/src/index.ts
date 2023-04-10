import algosdk, { AtomicTransactionComposer } from 'algosdk';
import { Buffer } from 'buffer';

// eslint-disable-next-line import/no-extraneous-dependencies
import appSpec from 'contract/artifacts/TokenMetadata.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import minterAppSpec from 'contract/artifacts/Minter.json';

const ARC_STRING = 'ARCXXXX';
const BOX_CREATE_COST = 0.0025e6;
const BOX_BYTE_COST = 0.0004e6;
const CONTRACT = new algosdk.ABIContract(appSpec.contract);
const MINTER_CONTRACT = new algosdk.ABIContract(minterAppSpec.contract);

type CreateFields = {
    total: number | bigint
    decimals: number
    manager: string
    unitName?: string
    assetName?: string
    clawback?: string
    note?: Uint8Array
    reserve?: string
    suggestedParams?: algosdk.SuggestedParams
    defaultFrozen?: boolean
    freeze?: string
}

export function getBoxName(assetID: number, key: string) {
  const arcBytes = new Uint8Array(Buffer.from(ARC_STRING));
  return new Uint8Array([...arcBytes, ...algosdk.encodeUint64(assetID), ...Buffer.from(key)]);
}

export async function createApp(
  algodClient: algosdk.Algodv2,
  sender: string,
  signer: algosdk.TransactionSigner,
): Promise<number> {
  const atc = new AtomicTransactionComposer();
  const compiledApproval = await algodClient.compile(Buffer.from(appSpec.source.approval, 'base64')).do();
  const compiledClear = await algodClient.compile(Buffer.from(appSpec.source.clear, 'base64')).do();

  const appCreateTxn = algosdk.makeApplicationCreateTxnFromObject({
    from: sender,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    approvalProgram: new Uint8Array(Buffer.from(compiledApproval.result, 'base64')),
    clearProgram: new Uint8Array(Buffer.from(compiledClear.result, 'base64')),
    numGlobalByteSlices: 0,
    numGlobalInts: 1,
    numLocalByteSlices: 0,
    numLocalInts: 0,
    suggestedParams: await algodClient.getTransactionParams().do(),
  });

  atc.addTransaction({ txn: appCreateTxn, signer });

  const results = await atc.execute(algodClient, 3);

  return (await algodClient.pendingTransactionInformation(results.txIDs[0]).do())['application-index'];
}

export async function createAsset(
  sender: string,
  signer: algosdk.TransactionSigner,
  algodClient: algosdk.Algodv2,
  appId: number,
  fields: CreateFields,
): Promise<number> {
  const suggestedParams = fields.suggestedParams || await algodClient.getTransactionParams().do();

  const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    ...fields,
    from: sender,
    suggestedParams,
    defaultFrozen: fields.defaultFrozen || false,
    assetURL: `${ARC_STRING}-${appId}`,
  });

  const asaATC = new AtomicTransactionComposer();

  asaATC.addTransaction({ txn: assetCreateTxn, signer });

  const results = await asaATC.execute(algodClient, 3);

  return (await algodClient.pendingTransactionInformation(results.txIDs[0]).do())['asset-index'];
}

function sliceIntoChunks(array: string[], chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
}

export async function createMetadataEntries(
  sender: string,
  signer: algosdk.TransactionSigner,
  appId: number,
  algodClient: algosdk.Algodv2,
  assetID: number,
  extraMetadata: Record<string, string>,
) {
  const atc = new AtomicTransactionComposer();
  const suggestedParams = await algodClient.getTransactionParams().do();

  const numBoxes = Object.keys(extraMetadata).length;
  let totalSize = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(extraMetadata)) {
    totalSize += key.length + value.length + ARC_STRING.length + 8;
  }

  const appFundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    from: sender,
    to: algosdk.getApplicationAddress(appId),
    amount: numBoxes * BOX_CREATE_COST + totalSize * BOX_BYTE_COST + 100_000,
  });

  atc.addTransaction({ txn: appFundTxn, signer });

  sliceIntoChunks(Object.keys(extraMetadata), 4).forEach((keysChunk) => {
    const keys = new Array(4).fill('');
    const values = new Array(4).fill('');

    keysChunk.forEach((k, i) => {
      values[i] = extraMetadata[k];
      keys[i] = k;
    });

    const boxes: algosdk.BoxReference[] = keysChunk.map((k) => ({
      name: getBoxName(assetID, k),
      appIndex: appId,
    }));

    atc.addMethodCall({
      appID: appId,
      method: algosdk.getMethodByName(CONTRACT.methods, 'updateMetadataEntries'),
      sender,
      signer,
      suggestedParams,
      methodArgs: [keys, values, assetID],
      boxes,
    });
  });

  await atc.execute(algodClient, 3);
}

export async function createAssetWithExtraMetadata(
  sender: string,
  signer: algosdk.TransactionSigner,
  algodClient: algosdk.Algodv2,
  fields: CreateFields,
  extraMetadata: Record<string, string> = {},
): Promise<{appID: number, assetID: number}> {
  const appId = await createApp(algodClient, sender, signer);

  const assetID = await createAsset(sender, signer, algodClient, appId, fields);

  await createMetadataEntries(sender, signer, appId, algodClient, assetID, extraMetadata);

  return { appID: appId, assetID };
}

export async function getMetadataField(
  algodClient: algosdk.Algodv2,
  assetId: number,
  field: string,
): Promise<string> {
  const appID = parseInt((await algodClient.getAssetByID(assetId).do()).params.url.replace(`${ARC_STRING}-`, ''), 10);

  const { value } = await algodClient.getApplicationBoxByName(
    appID,
    getBoxName(assetId, field),
  ).do();

  return Buffer.from(value).toString();
}

export async function callMinter(
  sender: string,
  signer: algosdk.TransactionSigner,
  algodClient: algosdk.Algodv2,
  fields: CreateFields,
  extraMetadata: Record<string, string>,
  minterApp: number,
  metadataApp: number,
): Promise<{appID: number, assetID: number}> {
  const tempATC = new AtomicTransactionComposer();
  const suggestedParams = await algodClient.getTransactionParams().do();

  tempATC.addMethodCall({
    sender,
    signer,
    suggestedParams: { ...suggestedParams, fee: 2 * algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
    appID: minterApp,
    method: algosdk.getMethodByName(MINTER_CONTRACT.methods, 'mint'),
    methodArgs: [
      fields.total,
      fields.decimals,
      fields.unitName || '',
      fields.assetName || '',
      fields.clawback || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
      fields.reserve || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
      fields.freeze || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
      fields.defaultFrozen ? 1 : 0,
      metadataApp,
    ],
  });

  tempATC.addMethodCall({
    sender,
    signer,
    suggestedParams: { ...suggestedParams, fee: 2 * algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
    appID: minterApp,
    method: algosdk.getMethodByName(MINTER_CONTRACT.methods, 'addMetadata'),
    methodArgs: [
      { txn: tempATC.clone().buildGroup().at(-1)!.txn, signer },
      Object.keys(extraMetadata),
      Object.values(extraMetadata),
    ],
  });

  const lastTxn = tempATC.clone().buildGroup().at(-1)!.txn;

  lastTxn.group = undefined;

  tempATC.addMethodCall({
    sender,
    signer,
    suggestedParams,
    appID: minterApp,
    method: algosdk.getMethodByName(MINTER_CONTRACT.methods, 'setManager'),
    methodArgs: [
      fields.manager || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
      { txn: lastTxn, signer },
    ],
  });

  const atc = new AtomicTransactionComposer();
  const txids: string[] = [];
  tempATC.buildGroup().forEach((t) => {
    const { txn } = t;
    if (txids.includes(txn.txID())) return;
    txids.push(txn.txID());

    txn.group = undefined;
    atc.addTransaction({ txn, signer });
  });

  const results = await atc.execute(algodClient, 3);

  const appID = results.methodResults[0].returnValue?.valueOf() as number;

  return { assetID: results.methodResults[1].returnValue?.valueOf() as number, appID };
}
