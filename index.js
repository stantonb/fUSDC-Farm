import "dotenv/config.js";
import { Web3 } from 'web3';
// import * as abiImport from './ABI/tUSDC.json' with { type: "json" };
import * as abiImport from './ABI/fUSDC.json' with { type: "json" };

const debug = false;
const runNumber = 1;
const { API_URL, PRIVATE_KEY_WALLET_1, PRIVATE_KEY_WALLET_2, PRIVATE_KEY_WALLET_3, PRIVATE_KEY_WALLET_4, CHAIN_ID, CONTRACT_ADDRESS } = process.env;
const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));
const airdropAccount1 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_1);
const airdropAccount2 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_2);
const airdropAccount3 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_3);
const airdropAccount4 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_4);
console.log("Airdrop account 1: ", airdropAccount1.address);
console.log("Airdrop account 2: ", airdropAccount2.address);
console.log("Airdrop account 2: ", airdropAccount3.address);
console.log("Airdrop account 2: ", airdropAccount4.address);

async function main() {
	await sendERC20Token();
}

async function sendERC20Token() {
	//randomise the amount between "0.000000001617" and "0.000000001235" ($1617 and $1235)
	const amount = ((Math.floor(Math.random() * 383) + 1235) / 1000000000000).toFixed(12);

	console.log("amount: ", amount * 1000000000000);
	console.log(new Date().toLocaleString());

	const abi = abiImport.default;
	const myContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

	let tx = await setUpTxn(myContract, airdropAccount1.address, airdropAccount2.address, amount);
	await sendTxn(airdropAccount1, tx);

	await randomSleep();
	
	tx = await setUpTxn(myContract, airdropAccount2.address, airdropAccount3.address, amount);
	await sendTxn(airdropAccount2, tx);

	await randomSleep();
	
	tx = await setUpTxn(myContract, airdropAccount3.address, airdropAccount4.address, amount);
	await sendTxn(airdropAccount3, tx);

	await randomSleep();
	
	tx = await setUpTxn(myContract, airdropAccount4.address, airdropAccount1.address, amount);
	await sendTxn(airdropAccount4, tx);
}

async function setUpTxn(myContract, from, to, amount) {
	const tx = {
		to: CONTRACT_ADDRESS, // Contract address
		chainId: CHAIN_ID
	};

	tx.from = from;
	tx.data = myContract.methods.transfer(to, web3.utils.toWei(amount, 'ether')).encodeABI();
	tx.gasPrice = await web3.eth.getGasPrice();
	tx.gas = await myContract.methods.transfer(to, web3.utils.toWei(amount, 'ether')).estimateGas({ from: from });

	console.log(debug ? tx : "");
	return tx;
}

async function sendEth(){
	let tx = {
		"from": airdropAccount1.address,
		"to": airdropAccount2.address,
		"value": web3.utils.toWei("0.0001", "ether"),
		"chainId": CHAIN_ID
	};

	tx.gasPrice = await web3.eth.getGasPrice();
	tx.gas = await web3.eth.estimateGas(tx);

	console.log(debug ? tx : "");
	await sendTxn(airdropAccount1, tx);
}

async function sendTxn(account, txn) {
	const signedTransaction = await web3.eth.accounts.signTransaction(txn, account.privateKey);
	console.log("Signed transaction: ", debug ? signedTransaction : "done");

	const txReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	console.log("Transaction hash: ", debug ? txReceipt : txReceipt.transactionHash);
}

async function randomSleep() {
	//sleep for between 20 seconds and 4 minutes
	// let sleepTime = Math.floor(Math.random() * 120) + 10;
	// console.log("Sleeping for " + sleepTime + " seconds");
	// await new Promise(r => setTimeout(r, sleepTime * 1000));
}

for (let i = 0; i < runNumber; i++) {
	await main();

	if (i < runNumber - 1) { // don't sleep after last run
		await randomSleep();
	}

	//every 5th run wait even longer
	if (i != 0 && i % 5 == 0) {
		await randomSleep();
		await randomSleep();
	}
}