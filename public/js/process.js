var currentAccount = "";
var contractGame;
var contractSocket;
$(document).ready(function(){
    //check metamask install?
    if (typeof window.ethereum !== 'undefined') {
        $("#metamaskIsInstall").html('MetaMask is installed!').css("color", "green");
    }else{
        $("#metamaskIsInstall").html('MetaMask is not install!').css("color", "red");
    }

    const abi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_gameId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_deadline",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_fee",
                    "type": "uint256"
                }
            ],
            "name": "CreateNewGame",
            "type": "event"
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
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "Pause",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_top1",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_top2",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_top3",
                    "type": "address"
                }
            ],
            "name": "Reward",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_point",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "SaveNewPoint",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "Unpause",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_fee",
                    "type": "uint256"
                }
            ],
            "name": "newGame",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "pause",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_top1",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_top2",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_top3",
                    "type": "address"
                }
            ],
            "name": "reward",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_point",
                    "type": "uint256"
                }
            ],
            "name": "savePoint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenAddress",
                    "type": "address"
                }
            ],
            "name": "setTokenTRC21",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
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
            "type": "function"
        },
        {
            "inputs": [],
            "name": "unpause",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "amount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "deadline",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "fee",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "gameId",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
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
            "type": "function"
        },
        {
            "inputs": [],
            "name": "paused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenTRC21",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "userPoints",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "gameId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "point",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "userAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const addressSM = "0x97EaF28E337459F587420a28BcC338A54d100352";
    var provider = new Web3.providers.HttpProvider('https://rpc.testnet.tomochain.com');
    const web3 = new Web3(provider);
    // window.ethereum.enable();
    contractGame = new web3.eth.Contract(abi, addressSM);

    console.log(contractGame);

    //admin
    contractGame.methods.tokenTRC21().call()
    .then(function(data){
        $("#tokenTRC21 input").val(data);
    })
    contractGame.methods.deadline().call()
    .then(function(data){
        let deadline = new Date(data * 1000);
        $("#deadline").html(`${deadline.getHours()}:${deadline.getMinutes()} ${deadline.getDate()}/${deadline.getMonth()}/${deadline.getFullYear()}`);
    })
    contractGame.methods.fee().call()
    .then(function(data){
        $("#fee").html(`${data/10**18} TAB`);
    })
    contractGame.methods.amount().call()
    .then(function(data){
        $("#amount").html(data);
    })
    //user
    
});

$("#checkMM").click(function(){
    connectMM().then((data)=>{
        $("#checkMM").replaceWith($("<h5>" + data + "</h5>"));
        $("#home .play-game").css("display", "flex");
        currentAccount = data;
    }).catch((err)=>{
        $("#checkMM").html("Please connect again");
    });
});

$("#tokenTRC21 button").click(function(){
    console.log(currentAccount);
    var tokenTRC21 = $("#tokenTRC21 input").val();
    contractGame.methods.setTokenTRC21(tokenTRC21).send(
        {from: currentAccount}
    ).then(function(){
        alert("Add token TRC21 success");
    }).catch(function(err){
        alert(err);
    });
});

$("#createGame").click(function(){
    let deadline = Date.parse($("#deadlineNew").val())/1000;
    let fee = $("#feeNew").val();

    contractGame.methods.newGame(deadline, String(fee * 10**18)).send(
        {from: currentAccount}
    ).then(function(){
        alert("Add new game success");
    }).catch(function(err){
        alert(err);
    });
});

$("#savePoint").click(function(){
    let point = $("#score").html();
    contractGame.methods.savePoint(point).send(
        {from: currentAccount}
    ).then(function(data){
        console.log(data);
    }).catch(function(err){
        console.log(err);
    });
})

async function connectMM(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
}