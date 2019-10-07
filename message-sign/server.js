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
    let nonce = jsonData.nonce.split('.');
    let nonceNumber = parseInt(nonce[0], 16);
    let timeStamp = parseInt(nonce[0], 16);
    let calcualtedNonce = parseInt(request.headers['content-nonce'], 16);
    let signed = request.headers['content-signed'];

    response.write(JSON.stringify({
      isMessageSigned: crypto.timingSafeEqual(signMessage(data), Buffer.from(signed, 'base64')),
      isNonceVerified: secureNonce(nonceNumber) === calcualtedNonce,
      isGoodTimeStamp: timeStamp - Date.now() < 30000
    }));
    response.end();

  });

}).listen(8080);