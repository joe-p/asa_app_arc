import algosdk, { AtomicTransactionComposer } from 'algosdk';
import { Buffer } from 'buffer';
import { TokenMetadata } from './tokenmetadata_client';

const ARC_STRING = 'ARCXXX';
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

export async function mintAsset(
  sender: string,
  signer: algosdk.TransactionSigner,
  algodClient: algosdk.Algodv2,
  fields: CreateFields,
  extraMetadata: Record<string, string> = {},
): Promise<{appID: number, assetID: number}> {
  const suggestedParams = fields.suggestedParams || await algodClient.getTransactionParams().do();

  const appClient = new TokenMetadata({
    client: algodClient,
    sender,
    signer,
  });

  await appClient.createApplication();

  const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    ...fields,
    suggestedParams,
    defaultFrozen: fields.defaultFrozen || false,
    assetURL: `${ARC_STRING}-${appClient.appId}`,
  });

  const asaATC = new AtomicTransactionComposer();

  asaATC.addTransaction({ txn: assetCreateTxn, signer });

  const results = await asaATC.execute(algodClient, 3);

  const assetID = (await algodClient.pendingTransactionInformation(results[0].txId).do())['asset-index'];

  const atc = new AtomicTransactionComposer();

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
    amount: numBoxes * BOX_CREATE_COST + totalSize * BOX_BYTE_COST,
  });

  atc.addTransaction({ txn: assetCreateTxn, signer });
  atc.addTransaction({ txn: appFundTxn, signer });

  atc.addMethodCall({
    appID: appClient.appId,
    method: algosdk.getMethodByName(appClient.methods, 'updateMetadataEntries'),
    sender,
    signer,
    suggestedParams,
    methodArgs: [Object.keys, Object.values, assetID],
    boxes: Object.keys(extraMetadata).map((k) => ({
      appIndex: 0,
      name: new Uint8Array(Buffer.from(ARC_STRING + k)),
    })),
  });

  await atc.execute(algodClient, 3);

  return { appID: appClient.appId, assetID };
}

export function updateAssetMetadataField() {}
