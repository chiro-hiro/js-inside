const http = require('http');
const crypto = require('crypto');

const secretKey = '99abc11aa959f16afe12c22a54622183fd2ac081fc1a182397635e4e2a03845d';

function secureNonce(val) {
  return (val >> 5 | val << 3 | val << 17) >>> 0;
}

function signMessage(signMessage) {
  return crypto.createHmac('sha256', secretKey).update(signMessage).digest('hex');
}

let randomNonnce = parseInt(Math.random() * 0xffffffff);

let body = JSON.stringify({
  type: 'requestBody',                            //Request type
  data: 'some fucking stupid text here',          //Data will be sent
  nonce: randomNonnce.toString(16)                             //Prevented replay attack
});

console.log('[Request]', body);
console.log('[Header]', JSON.stringify({
  'Content-Type': 'application/json',
  'Content-Length': body.length,
  'Content-Signed': signMessage(body),
  'Content-Nonce': secureNonce(randomNonnce).toString(16)
}));
let rq = http.request(
  {
    host: 'localhost',
    path: '/testSomeString',
    method: 'POST',
    headers:
    {
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      'Content-Signed': signMessage(body),
      'Content-Nonce': secureNonce(randomNonnce).toString(16)
    },
    port: 8080
  }, function (response) {

    let buffer = null;

    response.on('data', function (data) {
      if (buffer) {
        buffer = Buffer.concat([buffer, data]);
      }
      else {
        buffer = data;
      }
    });

    response.on('end', function () {
      console.log('[Response]', buffer.toString())
    });

  });

rq.write(body);
rq.end();