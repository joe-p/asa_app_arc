/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import algosdk from 'algosdk';
import { createAssetWithExtraMetadata } from 'sdk/src/index';
import PeraSession from './wallets/pera';

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

const accountsMenu = document.getElementById('accounts') as HTMLSelectElement;
const metadataTable = document.getElementById('metadata') as HTMLTableElement;

const totalInput = document.getElementById('total') as HTMLInputElement;
const decimalsInput = document.getElementById('decimals') as HTMLInputElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const unitName = document.getElementById('unit') as HTMLInputElement;

const buttonIds = ['connect', 'create', 'add', 'remove'];
const buttons: { [key: string]: HTMLButtonElement } = {};
const pera = new PeraSession();

function addBoxField() {
  const row = metadataTable.insertRow();
  const keyCell = row.insertCell();
  const valueCell = row.insertCell();

  keyCell.innerHTML = '<input type="text" class="key">';
  valueCell.innerHTML = '<input type="text" class="value">';
}

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

  const { appID } = await createAssetWithExtraMetadata(
    getAccount(),
    pera.signTxns,
    algodClient,
    {
      total: Number(totalInput.value),
      decimals: Number(decimalsInput.value),
      assetName: nameInput.value,
      unitName: unitName.value,
      manager: getAccount(),
    },
    metadata,
  );

  const boxes = (await algodClient.getApplicationBoxes(appID).do())
    .boxes.map((b) => Buffer.from(b.name).toString());

  console.log(boxes);
};
