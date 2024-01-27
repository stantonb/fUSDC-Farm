import "dotenv/config.js";
import { Web3 } from 'web3';
// import * as abiImport from './ABI/tUSDC.json' with { type: "json" };
import * as abiImport from './ABI/fUSDC.json' with { type: "json" };

const debug = false;
const runNumber = 2;
const { API_URL, PRIVATE_KEY_WALLET_1, PRIVATE_KEY_WALLET_2, CHAIN_ID, CONTRACT_ADDRESS } = process.env;
const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));
const airdropAccount1 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_1);
const airdropAccount2 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_2);
console.log("Airdrop account 1: ", airdropAccount1.address);
console.log("Airdrop account 2: ", airdropAccount2.address);

async function main() {
	await sendERC20Token(airdropAccount1, airdropAccount2);
}

async function sendERC20Token(airdropAccount1, airdropAccount2) {
	const amount = "0.000000001035"; // 1035 usdc
	const abi = abiImport.default;
	const myContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

	let tx = await setUpTxn(myContract, airdropAccount1.address, airdropAccount2.address, amount);
	await sendTxn(airdropAccount1, tx);

	await randomSleep();
	
	tx = await setUpTxn(myContract, airdropAccount2.address, airdropAccount1.address, amount);
	await sendTxn(airdropAccount2, tx);
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
	//sleep for between 5 seconds and 2 minutes
	let sleepTime = Math.floor(Math.random() * 120) + 5;
	console.log("Sleeping for " + sleepTime + " seconds");
	await new Promise(r => setTimeout(r, sleepTime * 1000));
}

for (let i = 0; i < runNumber; i++) {
	await main();

	if (i < runNumber - 1) { // don't sleep after last run
		await randomSleep();
	}
}