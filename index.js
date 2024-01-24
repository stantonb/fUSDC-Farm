import "dotenv/config.js";
import { Web3 } from 'web3';

const { API_URL, PRIVATE_KEY_WALLET_1, PRIVATE_KEY_WALLET_2, CHAIN_ID } = process.env;
const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));

async function main() {
	const airdropAccount1 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_1);
	// const airdropAccount2 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_2);

	let outboundTransaction = {
		"from": airdropAccount1.address,
		"to": "0x993Ead125EdC8cCB472a9ff6832FfeDC75d34Bdf",
		"chainId": CHAIN_ID
	};

	let gasPrice = await web3.eth.getGasPrice();
	console.log("Gas price: ", gasPrice);

	let estimateGas = await web3.eth.estimateGas(outboundTransaction);
	console.log("Estimate gas: ", estimateGas);

	outboundTransaction.gasPrice = gasPrice;
	outboundTransaction.gas = estimateGas;
	console.log(outboundTransaction);

	await sendTxn(airdropAccount1, outboundTransaction);

	// var inboundTransaction = {
	// 	"from": airdropAccount2.address,
	// 	"to": airdropAccount1.address,
	// 	"value": web3.utils.toHex(web3.utils.toWei("0.001", "ether")),
	// 	"gas": 200000,
	// 	"chainId": CHAIN_ID
	//   };

	// await sendTxn(inboundTransaction);
}

async function sendTxn(account, txn) {
	account.signTransaction(txn)
		.then(signedTx => {
			web3.eth.sendSignedTransaction(signedTx.rawTransaction);
		})
		.then(receipt => {
			console.log("Transaction receipt: ", receipt);
		}).catch(err => {
			console.log("Transaction error: ", err);
		});
}

main();