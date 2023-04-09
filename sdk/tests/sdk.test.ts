/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { expect } from 'chai';
import { TransactionSigner } from 'algosdk';
import { sandbox, clients } from 'beaker-ts';
import { Buffer } from 'buffer';
import {
  createApp, createAsset, createMetadataEntries, getMetadataField, createAssetWithExtraMetadata,
} from '../src/index';
import { TokenMetadata } from '../src/tokenmetadata_client';

const ARC_STRING = 'ARCXXXX';

let sender: string;
let signer: TransactionSigner;
let appClient: TokenMetadata;
let assetID: number;
let createFields: {
  total: number
  decimals: number
  unitName: string
  assetName: string
  manager: string
};

const algodClient = clients.sandboxAlgod();

describe('SDK', function () {
  before(async function () {
    const acct = (await sandbox.getAccounts())[0];
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
    appClient = await createApp(algodClient, sender, signer);
    expect(appClient.appId).to.be.greaterThan(0);
  });

  it('createAsset', async function () {
    assetID = await createAsset(sender, signer, algodClient, appClient, createFields);
    expect(assetID).to.be.greaterThan(0);
  });

  it('createMetadataEntries', async function () {
    await createMetadataEntries(sender, signer, appClient, algodClient, assetID, {
      one: 'key one',
      two: 'key two',
      three: 'key three',
      four: 'key four',
    });

    const boxes = (await appClient.getApplicationBoxNames()).map((k) => Buffer.from(k).toString());
    expect(boxes).includes.all.members([`${ARC_STRING}one`, `${ARC_STRING}two`, `${ARC_STRING}three`, `${ARC_STRING}four`]);

    boxes.forEach(async (key) => {
      const value = await appClient.getApplicationBox(key);

      expect(value).to.equal(`${key} ${key.replace(ARC_STRING, '')}`);
    });
  });

  it('getMetadataField', async function () {
    const value = await getMetadataField(algodClient, assetID, 'one');

    expect(value).to.equal('key one');
  });

  it('createAssetWithExtraMetadata', async function () {
    const jsonData = { foo: 'bar', hello: 'world' };

    const { appID } = await createAssetWithExtraMetadata(
      sender,
      signer,
      algodClient,
      createFields,
      {
        JSON: JSON.stringify(jsonData),
      },
    );

    const boxes = (await algodClient.getApplicationBoxes(appID).do())
      .boxes.map((b) => Buffer.from(b.name).toString());

    expect(boxes).to.deep.equal([`${ARC_STRING}JSON`]);

    const { value } = await algodClient.getApplicationBoxByName(appID, new Uint8Array(Buffer.from(`${ARC_STRING}JSON`))).do();

    expect(JSON.parse(Buffer.from(value).toString())).to.deep.equal(jsonData);
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

    const boxes = (await algodClient.getApplicationBoxes(appID).do())
      .boxes.map((b) => Buffer.from(b.name).toString());

    expect(boxes.sort()).to.deep.equal(Object.keys(metadata).map((k) => `${ARC_STRING}${k}`).sort());

    boxes.forEach(async (key) => {
      const { value } = await algodClient.getApplicationBoxByName(appID, new Uint8Array(Buffer.from(`${ARC_STRING}${key}`))).do();
      expect(value).to.equal(`value ${key}`);
    });
  });
});
