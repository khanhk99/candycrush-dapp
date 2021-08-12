var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./");
app.use("/node_modules", express.static(__dirname+"/node_modules"));

var server = require("http").Server(app);
server.listen(3000);

var bodyParser = require("body-parser");
const { default: Web3 } = require("web3");
app.use(bodyParser.urlencoded({extended:false}));

require("./route")(app);

async function loadContract() {
    return await new window.web3.eth.Contract("./abi.json", 0x6927498B716d1Df82Ec8660F6FC65D27f8882b84);
}