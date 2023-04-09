/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { expect } from 'chai';
import algosdk, { TransactionSigner } from 'algosdk';
import { Buffer } from 'buffer';
import {
  createApp, createAsset, createMetadataEntries, getMetadataField, createAssetWithExtraMetadata,
} from '../src/index';

const ARC_STRING = 'ARCXXXX';

let sender: string;
let signer: TransactionSigner;
let appId: number;
let assetID: number;
let createFields: {
  total: number
  decimals: number
  unitName: string
  assetName: string
  manager: string
};

async function getAccounts(): Promise<{
  addr: string,
  privateKey: Uint8Array,
  signer: algosdk.TransactionSigner,
}[]> {
  const kmdClient = new algosdk.Kmd('a'.repeat(64), 'http://localhost', 4002);

  const wallets = await kmdClient.listWallets();

  let walletId;
  for (const wallet of wallets.wallets) {
    if (wallet.name === 'unencrypted-default-wallet') walletId = wallet.id;
  }

  if (walletId === undefined) throw Error('No wallet named: "unencrypted-default-wallet"');

  const handleResp = await kmdClient.initWalletHandle(walletId, '');
  const handle = handleResp.wallet_handle_token;

  const addresses = await kmdClient.listKeys(handle);
  const acctPromises: Promise<{ private_key: Buffer }>[] = [];
  for (const addr of addresses.addresses) {
    acctPromises.push(kmdClient.exportKey(handle, '', addr));
  }
  const keys = await Promise.all(acctPromises);

  // Don't need to wait for it
  kmdClient.releaseWalletHandle(handle);

  return keys.map((k) => {
    const addr = algosdk.encodeAddress(k.private_key.slice(32));
    const acct = { sk: k.private_key, addr } as algosdk.Account;
    const txnSigner = algosdk.makeBasicAccountTransactionSigner(acct);
    return {
      addr: acct.addr,
      privateKey: acct.sk,
      signer: txnSigner,
    };
  });
}

const algodClient = new algosdk.Algodv2('a'.repeat(64), 'http://localhost', 4001);

async function getBoxes(app: number): Promise<Record<string, string>> {
  const { boxes } = await algodClient.getApplicationBoxes(app).do();

  const boxObject: Record<string, string> = {};

  const boxPromises = boxes.map(async (b) => {
    const box = await algodClient.getApplicationBoxByName(app, b.name).do();
    boxObject[Buffer.from(b.name).toString()] = Buffer.from(box.value).toString();
  });

  await Promise.all(boxPromises);

  return boxObject;
}

describe('SDK', function () {
  before(async function () {
    const acct = (await getAccounts())[0];
    sender = acct.addr;
    signer = acct.signer;
    createFields = {
      total: 1,
      decimals: 0,
      unitName: 'ASA',
      assetName: 'ASA',
      manager: sender,
    };
  });

  it('createApp', async function () {
    appId = await createApp(algodClient, sender, signer);
    expect(appId).to.be.greaterThan(0);
  });

  it('createAsset', async function () {
    assetID = await createAsset(sender, signer, algodClient, appId, createFields);
    expect(assetID).to.be.greaterThan(0);
  });

  it('createMetadataEntries', async function () {
    const metadata = {
      one: 'key one',
      two: 'key two',
      three: 'key three',
      four: 'key four',
    };

    await createMetadataEntries(sender, signer, appId, algodClient, assetID, metadata);

    const boxes = await getBoxes(appId);

    expect(Object.keys(boxes).sort()).to.deep.equal(Object.keys(metadata).map((k) => `${ARC_STRING}${k}`).sort());
    expect(Object.values(boxes).sort()).to.deep.equal(Object.values(metadata).sort());
  });

  it('getMetadataField', async function () {
    const value = await getMetadataField(algodClient, assetID, 'one');

    expect(value).to.equal('key one');
  });

  it('createAssetWithExtraMetadata', async function () {
    const jsonData = JSON.stringify({ foo: 'bar', hello: 'world' });

    const { appID } = await createAssetWithExtraMetadata(
      sender,
      signer,
      algodClient,
      createFields,
      {
        JSON: jsonData,
      },
    );

    const boxes = await getBoxes(appID);
    expect(boxes).to.deep.equal({ [`${ARC_STRING}JSON`]: jsonData });
  });

  it('60 properties', async function () {
    const metadata: Record<string, string> = {};
    Array.from(Array(60).keys()).forEach((n) => { metadata[n.toString()] = `value ${n}`; });

    const { appID } = await createAssetWithExtraMetadata(
      sender,
      signer,
      algodClient,
      createFields,
      metadata,
    );

    const boxes = await getBoxes(appID);

    expect(Object.keys(boxes).sort()).to.deep.equal(Object.keys(metadata).map((k) => `${ARC_STRING}${k}`).sort());
    expect(Object.values(boxes).sort()).to.deep.equal(Object.values(metadata).sort());
  });
});
