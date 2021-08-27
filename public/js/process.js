var currentAccount = "";
var contractGame;
var contractSocket;
const addressSM = "0xcd9abcC368aF6937fb987E9DcE1327d9E66Bf0e5";
const addressToken = "0x64FC6539E988bd8c1346A5bedbDaA9c210176d4b";
$(document).ready(function () {
    // check metamask install?
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.enable();
        $("#metamaskIsInstall").html('MetaMask is installed!').css("color", "green");
    } else {
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

    const token_abi = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "estimateFee",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "issuer",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "from",
                    "type": "address"
                },
                {
                    "name": "to",
                    "type": "address"
                },
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "minFee",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "setMinFee",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "to",
                    "type": "address"
                },
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "owner",
                    "type": "address"
                },
                {
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "symbol",
                    "type": "string"
                },
                {
                    "name": "decimals",
                    "type": "uint8"
                },
                {
                    "name": "cap",
                    "type": "uint256"
                },
                {
                    "name": "minFee",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "issuer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Fee",
            "type": "event"
        }
    ];

    connectMM();

    const web3 = new Web3(window.ethereum);
    contractGame = new web3.eth.Contract(abi, addressSM);
    contractToken = new web3.eth.Contract(token_abi, addressToken);

    console.log(contractGame);

    //admin
    contractGame.methods.tokenTRC21().call()
        .then(function (data) {
            $("#tokenTRC21 input").val(data);
        })
    contractGame.methods.deadline().call()
        .then(function (data) {
            let deadline = new Date(data * 1000);
            $("#deadline").html(`${deadline.getHours()}:${deadline.getMinutes()} ${deadline.getDate()}/${deadline.getMonth()}/${deadline.getFullYear()}`);
        })
    contractGame.methods.fee().call()
        .then(function (data) {
            $("#fee").html(`${data / 10**18} TAB`);
        })
    contractGame.methods.amount().call()
        .then(function (data) {
            $("#amount").html(data / 10**18);
        })
    //user
});

$("#checkMM").click(function () {
    connectMM().then((data) => {
        $("#checkMM").replaceWith($("<h5>" + data + "</h5>"));
        $("#home .play-game").css("display", "flex");
        currentAccount = data;
    }).catch((err) => {
        $("#checkMM").html("Please connect again");
    });
});

$("#tokenTRC21 button").click(function () {
    var tokenTRC21 = $("#tokenTRC21 input").val();
    contractGame.methods.setTokenTRC21(tokenTRC21).send({
        from: currentAccount
    }).then(function () {
        alert("Add token TRC21 success");
    }).catch(function (err) {
        alert(err);
    });
});

$("#createGame").click(function () {
    let deadline = Date.parse($("#deadlineNew").val()) / 1000;
    let fee = $("#feeNew").val();

    contractGame.methods.newGame(deadline, String(fee * 10**18)).send(
        { from: currentAccount }
    ).then(function () {
        alert("Add new game success");
    }).catch(function (err) {
        alert(err);
    });
});

$("#savePoint").click(async function () {
    $("body").addClass("loading");
    let fee = await contractGame.methods.fee().call();
    let transferFee = 100;
    console.log(`fee = ${fee}`)
    contractToken.methods.approve(addressSM, fee + transferFee).send(
        { from: currentAccount }
    ).then(function (data) {
        console.log(data);
        let point = $("#score").html();
        contractGame.methods.savePoint(point).send(
            { from: currentAccount }
        ).then(function (data) {
            $("body").removeClass("loading");
            alert("Add score success");
        }).catch(function (err) {
            alert("Add score fail");
            $("body").removeClass("loading");
        });
    }).catch(function (err) {
        $("body").removeClass("loading");
    })
})

$("#reward").click(function () {
    let top1 = $(".reward #top1").val();
    let top2 = $(".reward #top2").val();
    let top3 = $(".reward #top3").val();
    contractGame.methods.reward(top1, top2, top3).send(
        { from: currentAccount }
    ).then(function (data) {
        console.log(data);
    }).catch(function(err){
        console.log(err);
    })
})

async function connectMM() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
}