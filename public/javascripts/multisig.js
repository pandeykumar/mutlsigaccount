
 var rootUrl = "https://api.blockcypher.com/v1/btc/test3";

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
  console.log("Generated 3 new addresses for 2-of-3 multisig.");
	
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

// 2. Sign the hexadecimal strings returned with the fully built transaction and include
//    the source public address.
function signAndSend(newtx) {
  if (checkError(newtx)) return;

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
$(document).ready(function() {

   createMutliSig()

});
