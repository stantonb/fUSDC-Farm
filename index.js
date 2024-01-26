import "dotenv/config.js";
import { Web3 } from 'web3';

const debug = false;
const runNumber = 1;
const { API_URL, PRIVATE_KEY_WALLET_1, PRIVATE_KEY_WALLET_2, CHAIN_ID, CONTRACT_ADDRESS } = process.env;
const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));

async function main() {
	const airdropAccount1 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_1);
	const airdropAccount2 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY_WALLET_2);

	console.log("Airdrop account 1: ", airdropAccount1.address);
	console.log("Airdrop account 2: ", airdropAccount2.address);

	await sendERC20Token(airdropAccount1, airdropAccount2);
}

async function sendERC20Token(airdropAccount1, airdropAccount2) {
	const abi = [
		{
		  "inputs": [],
		  "stateMutability": "nonpayable",
		  "type": "constructor"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": true,
			  "internalType": "address",
			  "name": "owner",
			  "type": "address"
			},
			{
			  "indexed": true,
			  "internalType": "address",
			  "name": "spender",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "internalType": "uint256",
			  "name": "value",
			  "type": "uint256"
			}
		  ],
		  "name": "Approval",
		  "type": "event",
		  "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": true,
			  "internalType": "address",
			  "name": "previousOwner",
			  "type": "address"
			},
			{
			  "indexed": true,
			  "internalType": "address",
			  "name": "newOwner",
			  "type": "address"
			}
		  ],
		  "name": "OwnershipTransferred",
		  "type": "event",
		  "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
		},
		{
		  "anonymous": false,
		  "inputs": [
			{
			  "indexed": true,
			  "internalType": "address",
			  "name": "from",
			  "type": "address"
			},
			{
			  "indexed": true,
			  "internalType": "address",
			  "name": "to",
			  "type": "address"
			},
			{
			  "indexed": false,
			  "internalType": "uint256",
			  "name": "value",
			  "type": "uint256"
			}
		  ],
		  "name": "Transfer",
		  "type": "event",
		  "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
		},
		{
		  "inputs": [],
		  "name": "DAILY_MINT_AMOUNT",
		  "outputs": [
			{
			  "internalType": "uint256",
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0xa5ebc844"
		},
		{
		  "inputs": [],
		  "name": "MAX_SUPPLY",
		  "outputs": [
			{
			  "internalType": "uint256",
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0x32cb6b0c"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "owner",
			  "type": "address"
			},
			{
			  "internalType": "address",
			  "name": "spender",
			  "type": "address"
			}
		  ],
		  "name": "allowance",
		  "outputs": [
			{
			  "internalType": "uint256",
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0xdd62ed3e"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "spender",
			  "type": "address"
			},
			{
			  "internalType": "uint256",
			  "name": "amount",
			  "type": "uint256"
			}
		  ],
		  "name": "approve",
		  "outputs": [
			{
			  "internalType": "bool",
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0x095ea7b3"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "account",
			  "type": "address"
			}
		  ],
		  "name": "balanceOf",
		  "outputs": [
			{
			  "internalType": "uint256",
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0x70a08231"
		},
		{
		  "inputs": [],
		  "name": "decimals",
		  "outputs": [
			{
			  "internalType": "uint8",
			  "name": "",
			  "type": "uint8"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0x313ce567"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "spender",
			  "type": "address"
			},
			{
			  "internalType": "uint256",
			  "name": "subtractedValue",
			  "type": "uint256"
			}
		  ],
		  "name": "decreaseAllowance",
		  "outputs": [
			{
			  "internalType": "bool",
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0xa457c2d7"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "spender",
			  "type": "address"
			},
			{
			  "internalType": "uint256",
			  "name": "addedValue",
			  "type": "uint256"
			}
		  ],
		  "name": "increaseAllowance",
		  "outputs": [
			{
			  "internalType": "bool",
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0x39509351"
		},
		{
		  "inputs": [],
		  "name": "lastMinted",
		  "outputs": [
			{
			  "internalType": "uint256",
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0xbbc19ab0"
		},
		{
		  "inputs": [],
		  "name": "mintTokens",
		  "outputs": [],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0xeeb9635c"
		},
		{
		  "inputs": [],
		  "name": "name",
		  "outputs": [
			{
			  "internalType": "string",
			  "name": "",
			  "type": "string"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0x06fdde03"
		},
		{
		  "inputs": [],
		  "name": "owner",
		  "outputs": [
			{
			  "internalType": "address",
			  "name": "",
			  "type": "address"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0x8da5cb5b"
		},
		{
		  "inputs": [],
		  "name": "renounceOwnership",
		  "outputs": [],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0x715018a6"
		},
		{
		  "inputs": [],
		  "name": "symbol",
		  "outputs": [
			{
			  "internalType": "string",
			  "name": "",
			  "type": "string"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0x95d89b41"
		},
		{
		  "inputs": [],
		  "name": "totalSupply",
		  "outputs": [
			{
			  "internalType": "uint256",
			  "name": "",
			  "type": "uint256"
			}
		  ],
		  "stateMutability": "view",
		  "type": "function",
		  "constant": true,
		  "signature": "0x18160ddd"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "to",
			  "type": "address"
			},
			{
			  "internalType": "uint256",
			  "name": "amount",
			  "type": "uint256"
			}
		  ],
		  "name": "transfer",
		  "outputs": [
			{
			  "internalType": "bool",
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0xa9059cbb"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "from",
			  "type": "address"
			},
			{
			  "internalType": "address",
			  "name": "to",
			  "type": "address"
			},
			{
			  "internalType": "uint256",
			  "name": "amount",
			  "type": "uint256"
			}
		  ],
		  "name": "transferFrom",
		  "outputs": [
			{
			  "internalType": "bool",
			  "name": "",
			  "type": "bool"
			}
		  ],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0x23b872dd"
		},
		{
		  "inputs": [
			{
			  "internalType": "address",
			  "name": "newOwner",
			  "type": "address"
			}
		  ],
		  "name": "transferOwnership",
		  "outputs": [],
		  "stateMutability": "nonpayable",
		  "type": "function",
		  "signature": "0xf2fde38b"
		}
	  ];
	const amount = "100";
	const myContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
	const gasPrice = await web3.eth.getGasPrice();

	const tx = {
		to: CONTRACT_ADDRESS, // Contract address
		gasPrice: gasPrice,
		chainId: CHAIN_ID
	};

	tx.from = airdropAccount1.address;
	tx.data = myContract.methods.transfer(airdropAccount2.address, web3.utils.toWei(amount, 'ether')).encodeABI();
	tx.gas = await myContract.methods.transfer(airdropAccount2.address, web3.utils.toWei(amount, 'ether')).estimateGas({ from: airdropAccount1.address });

	console.log(debug ? tx : "");
	await sendTxn(airdropAccount1, tx);

	tx.from = airdropAccount2.address;
	tx.data = myContract.methods.transfer(airdropAccount1.address, web3.utils.toWei(amount, 'ether')).encodeABI();
	tx.gas = await myContract.methods.transfer(airdropAccount1.address, web3.utils.toWei(amount, 'ether')).estimateGas({ from: airdropAccount2.address });
	
	console.log(debug ? tx : "");
	await sendTxn(airdropAccount2, tx);
}

async function sendEth(){
	let tx = {
		"from": airdropAccount1.address,
		"to": airdropAccount2.address,
		"value": web3.utils.toWei("0.0001", "ether"),
		"chainId": CHAIN_ID
	};

	let gasPrice = await web3.eth.getGasPrice();
	console.log("Gas price: ", gasPrice);

	let estimateGas = await web3.eth.estimateGas(tx);
	console.log("Estimate gas: ", estimateGas);

	tx.gasPrice = gasPrice;
	tx.gas = estimateGas;
	console.log(tx);

	await sendTxn(airdropAccount1, tx);
}

async function sendTxn(account, txn) {
	const signedTransaction = await web3.eth.accounts.signTransaction(txn, account.privateKey);
	console.log("Signed transaction: ", debug ? signedTransaction : "done");

	const txReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	console.log("Transaction hash: ", debug ? txReceipt : txReceipt.transactionHash);
}

for (let i = 0; i < runNumber; i++) {
	await main();
}