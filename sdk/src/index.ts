import algosdk, { AtomicTransactionComposer } from 'algosdk';
import { Buffer } from 'buffer';
import { TokenMetadata } from './tokenmetadata_client';

const ARC_STRING = 'ARCXXXX';
const BOX_CREATE_COST = 0.0025e6;
const BOX_BYTE_COST = 0.0004e6;

type CreateFields = {
    total: number | bigint
    decimals: number
    from: string
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

export async function createApp(
  algodClient: algosdk.Algodv2,
  sender: string,
  signer: algosdk.TransactionSigner,
): Promise<TokenMetadata> {
  const appClient = new TokenMetadata({
    client: algodClient,
    sender,
    signer,
  });

  await appClient.createApplication();

  return appClient;
}

export async function createAsset(
  sender: string,
  signer: algosdk.TransactionSigner,
  algodClient: algosdk.Algodv2,
  appClient: TokenMetadata,
  fields: CreateFields,
): Promise<number> {
  const suggestedParams = fields.suggestedParams || await algodClient.getTransactionParams().do();

  const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    ...fields,
    from: sender,
    suggestedParams,
    defaultFrozen: fields.defaultFrozen || false,
    assetURL: `${ARC_STRING}-${appClient.appId}`,
  });

  const asaATC = new AtomicTransactionComposer();

  asaATC.addTransaction({ txn: assetCreateTxn, signer });

  const results = await asaATC.execute(algodClient, 3);

  return (await algodClient.pendingTransactionInformation(results.txIDs[0]).do())['asset-index'];
}

export async function createMetadataEntries(
  sender: string,
  signer: algosdk.TransactionSigner,
  appClient: TokenMetadata,
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
    totalSize += key.length + value.length + ARC_STRING.length;
  }

  const appFundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    from: sender,
    to: appClient.appAddress,
    amount: numBoxes * BOX_CREATE_COST + totalSize * BOX_BYTE_COST + 100_000,
  });

  atc.addTransaction({ txn: appFundTxn, signer });

  const keys = new Array(4).fill('');
  const values = new Array(4).fill('');

  Object.values(extraMetadata).forEach((v, i) => { values[i] = v; });
  Object.keys(extraMetadata).forEach((v, i) => { keys[i] = v; });

  const boxes: algosdk.BoxReference[] = Object.keys(extraMetadata).map((k) => {
    const nameString = ARC_STRING + k;
    const name = new Uint8Array(Buffer.from(nameString, 'utf-8'));

    return {
      name,
      appIndex: appClient.appId,
    };
  });

  atc.addMethodCall({
    appID: appClient.appId,
    method: algosdk.getMethodByName(appClient.methods, 'updateMetadataEntries'),
    sender,
    signer,
    suggestedParams,
    methodArgs: [keys, values, assetID],
    boxes,
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
  const appClient = await createApp(algodClient, sender, signer);

  const assetID = await createAsset(sender, signer, algodClient, appClient, fields);

  await createMetadataEntries(sender, signer, appClient, algodClient, assetID, extraMetadata);

  return { appID: appClient.appId, assetID };
}

export async function getMetadataField(
  algodClient: algosdk.Algodv2,
  assetId: number,
  field: string,
): Promise<string> {
  const appID = parseInt((await algodClient.getAssetByID(assetId).do()).params.url.replace(`${ARC_STRING}-`, ''), 10);

  const { value } = await algodClient.getApplicationBoxByName(
    appID,
    new Uint8Array(Buffer.from(ARC_STRING + field)),
  ).do();

  return Buffer.from(value).toString();
}
