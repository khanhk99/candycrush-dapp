var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./");
app.use("/node_modules", express.static(__dirname+"/node_modules"));

var server = require("http").Server(app);
server.listen(3000);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

const Web3 = require("web3");

require("./route")(app);