 var express = require('express');

var app = express();
app.set('views',__dirname + '/views');
app.engine('html',require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
        
app.get('/getStock', function(request,response){


	//if(request.query.symbol && request.query.symbol.length > 0) {
var url = require('url');
			var url_parts = url.parse(request.url,true);
	var query = url_parts.query;
	var symbol = query.symbol;
		//console.log("Symbol Requested - " + request.query.symbol);
		
		var http = require('http');
       // response.header("Access-Control-Allow-Origin", "*");
       // response.header("Access-Control-Allow-Headers", "X-Requested-With");
		var symbol = request.query.symbol;
		var options = {
		  host: 'www.nseindia.com',
		  method: 'GET',
		  path: '/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?symbol='+symbol,
		  headers: {
		  	"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
		  	"Referer": "http://www.nseindia.com/",
		  	"Accept": '*/*'
		  }
		};

		var resp = "";	// Hold the servers response

		var req = http.request(options, function(res) {
			res.on('error', function(e) {
				console.log("Got error: " + e.message);
			});
			res.on('data', function(data) {
				resp += data;
			});
			res.on('end', function() {
				resp = resp.trim();
				data = JSON.parse(resp);

				if(data.data.length < 1) {
					// Invalid Symbol
					response.send('<h1>Invalid Symbol</h1><p>Invalid Symbol given. Refer valid list of Symbols at <a href="http://blog.ashwanthkumar.in/2012/01/nse-valid-symbols.html">here</a></p>');
					return;
				}

				// Cleaning up the feeds
				delete data.otherSeries;
				delete data.optLink;
				delete data.futLink;
				
				// Now send the data
				response.send(data);
				
				// @TODO Can still filter to provide more precise data 
			});
		});
		req.end();
/*	} else {
		// Invalid request
		response.send(invalidRequest(), 400);
	}*/
   // require('./controllers/stock').getStock(req,res);
});

app.get('/', function(req,res){
/* var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET','HYPERLINK "https://api.practo.com/doctors/?page=1%27%2cfalse"https://api.practo.com/doctors/?page=1',false);
    xmlhttp.setRequestHeader("X-API-KEY","qPyOrdb7NEsXfvJ4CHyDisLa+ds=");
    xmlhttp.setRequestHeader("X-CLIENT-ID","27979c0c-52ac-4e33-8a23-710042499d7f");
    xmlhttp.send();
    var responseJSON = JSON.parse(xmlhttp.responseText);
    console.log(responseJSON);*/
    res.render('stock.html');
});
app.listen(3000, function(){
    console.log('Listening on port 3000');
});