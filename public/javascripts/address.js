
var allAddresses = [];

$(document).ready(function() {

   getFundingAddresses();
   getMultiSigAddress();


});

function getFundingAddresses(){

      // Empty content string
       var addressTableContent = '';



       $.getJSON( '/address/fundingaddresses', function( data ) {
              
	       $.each(data, function(){            
	            addressTableContent += '<tr>';
	            addressTableContent += '<td><a href="#" class="linkshowuser" rel="' + this.address + '">' + this.address + '</a></td>';
	            addressTableContent += '<td>'+ this.balance + '</td>';            
	            addressTableContent += '</tr>';
	        });

	        // Inject the whole content string into our existing HTML table
	        $('#addresses table tbody').html(addressTableContent);
	    });

};


function getMultiSigAddress(){

    var multisigaddressesTableContent='';

	$.getJSON( '/multisig/getaddresses', function( data ) {
              
	       $.each(data, function(){            
	            multisigaddressesTableContent += '<tr>';
	            multisigaddressesTableContent += '<td><a href="#" class="linkshowuser" rel="' + this.address + '">' + this.address + '</a></td>';
	            multisigaddressesTableContent += '<td>'+ this.balance + '</td>';            
	            multisigaddressesTableContent += '</tr>';
	        });

	        // Inject the whole content string into our existing HTML table
	        $('#multisigaddresses table tbody').html(multisigaddressesTableContent);
	    });


};
