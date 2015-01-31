var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');
var $ = require('jquery');

var rootUrl = "http://api.blockcypher.com/v1/bcy/test/";

router.get('/', function(req, res, next) {
  res.render('multisig', { title: 'multisig' });
});

/* GET addresses listing. */
router.get('/getaddresses', function(req, res, next) {
  var results = [];
  //todo, get from db and blockcypher api
  results.push({ "address": "3B7c7pMQkrtn9k5F5whUf5qMfSH3aefJtK", "balance":4000});
  results.push({ "address": "3zXb59gMYymcdooNz2jFiYRTV1VZ8R7hNW", "balance":3000});
  res.json(results);

});



router.get('/create', function(req, res, next) {
	var results = [];	
	var newtx= {};
    var txnsend={};
	var source = {
	  private : "c912ccfa95ce97d79dc2d8f3f79bb8fe27e120f5b90d4423e8cad0f5b632e9fd",
	  public  : "02dcc4cae5f54356b2a1470324ac7f4bc7204dd68071594d21da2925944d1e2c8b",
	  address : "BzXb59gMYymcdooNz2jFiYRTV1VZ8R7hNW"
	}
	var key   = new bitcoin.ECKey(bigi.fromHex(source.private), true);
	var addrs = [];
	// 0. We get 3 newly generated address
	addrs[0] = {
	  "private": "40e02af581f78f7e0a7a94572eb00ed324f24864480b8553cdfc1cf5a0392d5d",
	  "public": "029e85eb616b3644e05c802a378984e565a76cd2524922915336271a3d2de44cb5",
	  "address": "C8LpVQAmRr27GTFhYDXZXuMiyaKqnjokab"
	};
	addrs[1] = {
	  "private": "1dca8a6dd62b38559ecacf8ddc810081b2e9c650e949d853cfca3ac12e21ea59",
	  "public": "030596e11eb45f3840c581cec6abfc55ec4a10053ca408ffca2b8f641c19574bc5",
	  "address": "CBTNYWFQSKS8Boz4jq6gqLtyVKggNvw4yz"
	};

	addrs[2] = {
	  "private": "9cfb91c93ae965f1eabebc54d94f550de990dbba81cbcf57ff0d5e502d93c593",
	  "public": "0358d7d588a7ff181036f4d88b6b2212da354123af547753c96fdd8dc9841c0302",
	  "address": "C6qeEaBgFmqB7HrNLd26FB3C8s3jKW1vC3"
	}
	console.log("Added 3 new addresses for 2-of-3 multisig.");
    

/*
    async.series([
	       //make funding txn
	       function(callback) {
					var newtx = {
						"inputs": [{"addresses": [source.address]}],
						"outputs": [{
						  "addresses"   : [addrs[0].public, addrs[1].public, addrs[2].public],
						  "script_type" : "multisig-2-of-3",
						  "value"       : 25000
						}]
					}
					console.log("txs/new before posting: " + JSON.stringify(newtx));				  
					request.post({
					  headers: {'content-type' : 'application/x-www-form-urlencoded'},
					  url:     rootUrl+"txs/new?token=7829a3a92bb16658dface30fe436f85d",
					  body:    JSON.stringify(newtx)
					}, function(error, response, body){					  
					  if (!error && response.statusCode == 200) {
					  	console.log('newTxn:' + body);
					    newtx = body;
					    callback(); 
					  } else {
					  	console.log('error in txn new:' + response.statusCode);
					    callback(error);
					  }
					  
					});				
	       },
	       function(callback) {
				console.log('in signAndSend newtx : ' + newtx); 
				
				newtx.pubkeys     = [];
				newtx.signatures  = newtx.tosign.map(function(tosign) {
					newtx.pubkeys.push(source.public);
					return key.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
				});
				request.post({
				  headers: {'content-type' : 'application/json'},
				  url:     rootUrl+"txs/send?token=7829a3a92bb16658dface30fe436f85d",
				  body:    JSON.stringify(newtx)
				}, function(error, response, body){
				  console.log('newTxn:' + body);
				  if (!error && response.statusCode == 200) {
				    console.log("txn/send response:" + body);
				    txnsend = body;
				    callback(); 
				  } else {
				    callback(error);
				  }
				  
				});				

	       }
       ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err);
        //Here locals will be populated with 'user' and 'posts'
        res.json(txnsend);
    });
    	*/	
	// 1. Post our funding transaction, sending money from a standard address to the multisig
	// address for our 3 keys.
	function newFundingTransaction() {
		console.log("In newFundingTransaction");
	  var newtx = {
	    "inputs": [{"addresses": [source.address]}],
	    "outputs": [{
	      "addresses"   : [addrs[0].public, addrs[1].public, addrs[2].public],
	      "script_type" : "multisig-2-of-3",
	      "value"       : 25000,
	    }]
	  }
	  return $.post(rootUrl+"/txs/new?token=7829a3a92bb16658dface30fe436f85d", JSON.stringify(newtx));
	}

var newTxnFromCmdline = {
  "tx": {
    "block_height": -1,
    "hash": "c0f8afb28fb78bcae0e896636236e7031549b975668c6d3221e323a5191888db",
    "addresses": [
      "BzXb59gMYymcdooNz2jFiYRTV1VZ8R7hNW",
      "DhXuUypRxYuDZmxv3Ve73ZGxDRf9UHXSCK"
    ],
    "total": 488000,
    "fees": 12000,
    "preference": "high",
    "relayed_by": "108.76.153.129",
    "confirmed": "0001-01-01T00:00:00Z",
    "received": "2015-01-31T06:47:29.371394052Z",
    "ver": 1,
    "lock_time": 0,
    "double_spend": false,
    "vin_sz": 1,
    "vout_sz": 2,
    "confirmations": 0,
    "inputs": [
      {
        "prev_hash": "8783bf591f8f3327f422424f822fe41262d3f0965995de6604a08b43344d6a05",
        "output_index": 0,
        "script": "",
        "output_value": 500000,
        "sequence": 4294967295,
        "addresses": [
          "BzXb59gMYymcdooNz2jFiYRTV1VZ8R7hNW"
        ],
        "script_type": ""
      }
    ],
    "outputs": [
      {
        "value": 25000,
        "script": "a9148f34dda6764e2c40d07e6e2c09ff60c655530fc287",
        "spent_by": "",
        "addresses": [
          "DhXuUypRxYuDZmxv3Ve73ZGxDRf9UHXSCK"
        ],
        "script_type": "pay-to-script-hash"
      },
      {
        "value": 463000,
        "script": "76a91451310b6bcecff7de5866a267d849796e9ab6e06e88ac",
        "spent_by": "",
        "addresses": [
          "BzXb59gMYymcdooNz2jFiYRTV1VZ8R7hNW"
        ],
        "script_type": "pay-to-pubkey-hash"
      }
    ]
  },
  "tosign": [
    "b8d77e2362c4b309f7cd5bf39dfc0240e7748c76787b34381153514c6cb5bc22"
  ]};
	// 2. Sign the hexadecimal strings returned with the fully built transaction and include
	//    the source public address.

	function sign(newtx) {
	  console.log('in sign ') 	  

	  newtx.pubkeys     = [];
	  newtx.signatures  = newtx.tosign.map(function(tosign) {
	    newtx.pubkeys.push(source.public);
	    return key.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
	  });

	  console.log('signed is:'+ JSON.stringify(newtx));
	}

	function signAndSend(newtx) {
	  console.log('in signAndSend') 	  

	  newtx.pubkeys     = [];
	  newtx.signatures  = newtx.tosign.map(function(tosign) {
	    newtx.pubkeys.push(source.public);
	    return key.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
	  });

	  return $.post(rootUrl+"/txs/send?token=7829a3a92bb16658dface30fe436f85d", JSON.stringify(newtx));
	}

	function createMutliSig() {
		console.log("increate multisig");
		var response = signAndSend(newFundingTransaction);
		console.log(response);
	}

    sign(newTxnFromCmdline);
});


module.exports = router;
