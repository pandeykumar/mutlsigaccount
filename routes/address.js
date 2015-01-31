var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
/* GET addresses listing. */
router.get('/', function(req, res, next) {
  res.render('address', { title: 'Address' });
});


/* GET funding addresses listing. */
router.get('/fundingaddresses', function(req, res, next) {
  var db = req.db;
  var results = [];
  results.push({ "address": "CB7c7pMQkrtn9k5F5whUf5qMfSH3aefJtK", "balance":0});
  results.push({ "address": "BzXb59gMYymcdooNz2jFiYRTV1VZ8R7hNW", "balance":0});
 /* 
  db.collection('funding_addresses').find().toArray(function (err, items) {
  	items.map(function(item){
  		results = { "address": item.address, "balance":0}
  	}  
  });
   */
        //get balance for each address 
  async.forEach(results, function(result, callback) { //The second argument (callback) is the "task callback" for a specific messageId
        console.log("get balance for " + result.address)//When the db has deleted the item it will call the "task callback". This way async knows which items in the collection have finished
        invokeAndProcessBlockCypherResponse(result.address, callback, results);
    }, function(err) {
        if (err) return next(err);
        //Tell the user about the great success
        console.log("returning result");
        res.json(results);
    });

});

var invokeAndProcessBlockCypherResponse = function(address,callback ,results){
  request('http://api.blockcypher.com/v1/bcy/test/addrs/'+address+'?token=7829a3a92bb16658dface30fe436f85d', function (error, response, body) {        
    if (!error && response.statusCode == 200) {
      status = "succeeded";
      addResponse = JSON.parse(body);
	  console.log('repsone balance is'+ addResponse.balance);			    
      //update the balance for the address
      results.map(function(item){
         if(item.address == address) {
         	item.balance = addResponse.balance;
         };
      });
      callback();
    } else {
      callback(error);
    }
  })};



module.exports = router;
