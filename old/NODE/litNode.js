var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;
	
	
	var PORT = 7777;
var HOST = '192.168.4.1';

var dgram = require('dgram');

var client = dgram.createSocket('udp4');
	
voice	

http.createServer(function(request, response) {
	//console.log("new request body::");
	

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  

	if (uri == "/setlights"){
		var body = [];
		var body = [];
request.on('data', function(chunk) {
  body.push(chunk);
}).on('end', function() {
  body = Buffer.concat(body).toString();
  // at this point, `body` has the entire request body stored in it as a string
  //console.log(body);
  client.send(body, 0, body.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
});
});
		
	}
	
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");