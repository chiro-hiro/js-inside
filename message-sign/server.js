const http = require('http');
const crypto = require('crypto');

const secretKey = '99abc11aa959f16afe12c22a54622183fd2ac081fc1a182397635e4e2a03845d';

function secureNonce(val) {
  return (val >> 5 | val << 3 | val << 17) >>> 0;
}

function signMessage(signMessage) {
  return crypto.createHmac('sha256', secretKey).update(signMessage).digest();
}


http.createServer(function (request, response) {

  let buffer = null;

  request.on('data', function (data) {
    if (buffer) {
      buffer = Buffer.concat([buffer, data]);
    }
    else {
      buffer = data;
    }
  });

  request.on('end', function () {

    let data = buffer.toString();
    let jsonData = JSON.parse(data);
    let nonce = parseInt(jsonData.nonce, 16);
    let calcualtedNonce = parseInt(request.headers['content-nonce'], 16);
    let signed = request.headers['content-signed'];

    response.write(JSON.stringify({
      isMessageSigned: crypto.timingSafeEqual(signMessage(data), Buffer.from(signed, 'hex')),
      isNonceVerified: secureNonce(nonce) === calcualtedNonce
    }));
    response.end();

  });

}).listen(8080);