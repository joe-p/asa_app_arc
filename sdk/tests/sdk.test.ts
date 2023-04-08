/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { expect } from 'chai';
import { TransactionSigner } from 'algosdk';
import { sandbox, clients } from 'beaker-ts';
import { Buffer } from 'buffer';
import { createApp, createAsset, createMetadataEntries } from '../src/index';
import { TokenMetadata } from '../src/tokenmetadata_client';

const ARC_STRING = 'ARCXXXX';

let sender: string;
let signer: TransactionSigner;
let appClient: TokenMetadata;
let assetID: number;
const algodClient = clients.sandboxAlgod();

describe('SDK', function () {
  before(async function () {
    const acct = (await sandbox.getAccounts())[0];
    sender = acct.addr;
    signer = acct.signer;
  });

  it('createApp', async function () {
    appClient = await createApp(algodClient, sender, signer);
    expect(appClient.appId).to.be.greaterThan(0);
  });

  it('createAsset', async function () {
    assetID = await createAsset(sender, signer, algodClient, appClient, {
      total: 1,
      decimals: 0,
      unitName: 'ASA',
      assetName: 'ASA',
      from: sender,
      manager: sender,
    });
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

      expect(value).to.be(`${key} ${key.replace(ARC_STRING, '')}`);
    });
  });
});
