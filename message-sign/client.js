const http = require('http');
const crypto = require('crypto');

const secretKey = '99abc11aa959f16afe12c22a54622183fd2ac081fc1a182397635e4e2a03845d';

function u(v) {
  return ((v | 0) & 0xffffffff) >>> 0;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest()
}

function secureNonce(v) {
  let t = [[], [], [], []];
  let buf = sha256(secretKey);
  for (let c = 0; c < 16; c++) {
    buf = sha256(buf);
    let r = u((v + buf.readUInt32BE(0)));
    t[(c / 4) >>> 0][c % 4] = (r % 2 === 0) ? r : (r >>> 16) | (r << 16);
  }
  return u([
    t[0][0] ^ t[1][1] ^ t[2][2] ^ t[3][3],
    t[1][0] ^ t[2][1] ^ t[3][2] ^ t[0][3],
    t[2][0] ^ t[3][1] ^ t[0][2] ^ t[1][3],
    t[3][0] ^ t[0][1] ^ t[1][2] ^ t[2][3]
  ][v % 3]);
}

function signMessage(signMessage) {
  return crypto.createHmac('sha256', secretKey).update(signMessage).digest().toString('base64');
}

let randomNonnce = parseInt(Math.random() * 0xffffffff) >>> 0;

let body = JSON.stringify({
  type: 'requestBody',
  data: 'some fucking stupid text here',
  nonce: `${randomNonnce.toString(16)}.${Date.now().toString(16)}`
});

let header = {
  'Content-Type': 'application/json',
  'Content-Length': body.length,
  'Content-Signed': signMessage(body),
  'Content-Nonce': secureNonce(randomNonnce).toString(16)
};

console.log('[Request]', body);
console.log('[Header]', JSON.stringify(header));

let rq = http.request(
  {
    host: 'localhost',
    path: '/testSomeString',
    method: 'POST',
    headers: header,
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