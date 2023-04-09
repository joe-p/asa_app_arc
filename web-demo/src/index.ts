/* eslint-disable no-alert */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import algosdk from 'algosdk';
import { createAsset, createMetadataEntries } from 'sdk/src/index';
import PeraSession from './wallets/pera';

const TESTNET_APP = 180675275;
const ARC_STRING = 'ARCXXXX';

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

const accountsMenu = document.getElementById('accounts') as HTMLSelectElement;
const metadataTable = document.getElementById('metadata') as HTMLTableElement;

const totalInput = document.getElementById('total') as HTMLInputElement;
const decimalsInput = document.getElementById('decimals') as HTMLInputElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const unitName = document.getElementById('unit') as HTMLInputElement;

const totalCost = document.getElementById('total-cost') as HTMLElement;
const boxMbrCost = document.getElementById('box-mbr') as HTMLElement;
const asaMbrCost = document.getElementById('asa-mbr') as HTMLElement;
const fees = document.getElementById('fees') as HTMLElement;

const BOX_CREATE_COST = 0.0025;
const BOX_BYTE_COST = 0.0004;

const buttonIds = ['connect', 'create', 'add', 'remove'];
const buttons: { [key: string]: HTMLButtonElement } = {};
const pera = new PeraSession();

function calculateTotalCost() {
  const total = parseFloat(fees.innerHTML)
  + parseFloat(boxMbrCost.innerHTML)
  + parseFloat(asaMbrCost.innerHTML);

  totalCost.innerHTML = total.toFixed(4).toString();
}

function calculateMBRandFees() {
  const keys = Array.from(metadataTable.querySelectorAll('.key')).map((i: HTMLInputElement) => i.value.length + ARC_STRING.length + 8);
  const values = Array.from(metadataTable.querySelectorAll('.value')).map((i: HTMLInputElement) => i.value.length);

  const totalSize = keys.reduce((a, b) => a + b, 0) + values.reduce((a, b) => a + b, 0);

  const boxMbr = BOX_CREATE_COST * keys.filter((k) => k > 0).length + BOX_BYTE_COST * totalSize;

  boxMbrCost.innerHTML = boxMbr.toFixed(4).toString();

  const totalFee = Math.ceil(keys.filter((k) => k > 0).length / 4) * 0.001;

  fees.innerHTML = (0.0020 + totalFee).toFixed(4).toString();

  calculateTotalCost();
}

function addBoxField() {
  const row = metadataTable.insertRow();
  const keyCell = row.insertCell();
  const valueCell = row.insertCell();
  keyCell.oninput = calculateMBRandFees;
  valueCell.oninput = calculateMBRandFees;

  keyCell.innerHTML = '<input type="text" class="key">';
  valueCell.innerHTML = '<input type="text" class="value">';
}

async function getBoxes(app: number): Promise<Record<string, string>> {
  const { boxes } = await algodClient.getApplicationBoxes(app).do();

  const boxObject: Record<string, string> = {};

  const boxPromises = boxes.map(async (b) => {
    const box = await algodClient.getApplicationBoxByName(app, b.name).do();
    boxObject[
      Buffer.from(b.name).toString().substring(ARC_STRING.length + 8)
    ] = Buffer.from(box.value).toString();
  });

  await Promise.all(boxPromises);

  return boxObject;
}

function signer(txns: algosdk.Transaction[]) {
  return pera.signTxns(txns);
}

calculateTotalCost();

Array(4).fill(null).forEach(() => {
  addBoxField();
});

function getAccount(): string {
  return accountsMenu.selectedOptions[0].value;
}

buttonIds.forEach((id) => {
  buttons[id] = document.getElementById(id) as HTMLButtonElement;
});

buttons.add.onclick = () => {
  if (metadataTable.rows.length === 60) {
    // eslint-disable-next-line no-alert
    alert('You can only have 60 metadata fields');
    return;
  }

  addBoxField();
};

buttons.remove.onclick = () => {
  if (metadataTable.rows.length > 1) metadataTable.deleteRow(metadataTable.rows.length - 1);
};

buttons.connect.onclick = async () => {
  await pera.getAccounts();
  pera.accounts.forEach((account) => {
    accountsMenu.add(new Option(account, account));
  });
};

buttons.create.onclick = async () => {
  const metadata: Record<string, string> = {};
  const keys = Array.from(metadataTable.querySelectorAll('.key')).map((i: HTMLInputElement) => i.value);
  const values = Array.from(metadataTable.querySelectorAll('.value')).map((i: HTMLInputElement) => i.value);

  keys.forEach((k, i) => {
    if (k === '') return;
    metadata[k] = values[i];
  });

  const createFields = {
    total: Number(totalInput.value),
    decimals: Number(decimalsInput.value),
    assetName: nameInput.value,
    unitName: unitName.value,
    manager: getAccount(),
  };

  const sender = getAccount();

  alert('There will be a total of two transaction groups to sign.\n1. Asset creation\n2. Metadata creation');

  const assetID = await createAsset(sender, signer, algodClient, TESTNET_APP, createFields);

  await createMetadataEntries(sender, signer, TESTNET_APP, algodClient, assetID, metadata);

  console.log(await getBoxes(TESTNET_APP));
};
