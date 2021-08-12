$(document).ready(function(){
    //check metamask install?
    if (typeof window.ethereum !== 'undefined') {
        $("#metamaskIsInstall").html('MetaMask is installed!').css("color", "green");
    }else{
        $("#metamaskIsInstall").html('MetaMask is not install!').css("color", "red");
    }
});

$("#checkMM").click(function(){
    connectMM().then((data)=>{
        $("#checkMM").replaceWith($("<h5>" + data + "</h5>"));
    }).catch((err)=>{
        $("#checkMM").html("Please connect again");
    });
})

async function connectMM(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
}