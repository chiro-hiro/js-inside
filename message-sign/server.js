const http = require('http');
const crypto = require('crypto');

const secretKey = '99abc11aa959f16afe12c22a54622183fd2ac081fc1a182397635e4e2a03845d';

function secureNonce(v) {
  function u(v) {
    return ((v | 0) & 0xffffffff) >>> 0;
  }
  let t = [
    [0xbd4ece14, 0xf2d95de9, 0xb9753d13, 0xd2878de0],
    [0x8ecbd8f7, 0x71f796db, 0x31d01ca7, 0xdc1c0848],
    [0xe91bec75, 0xd492ee8d, 0x2815c977, 0xa6b37abc],
    [0x8dfecc22, 0x53275d6d, 0x9e0aa24a, 0xbccc669c]
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      t[i][j] = u((v + t[i][j]));
    }
  }
  return u(
    t[0][0] ^ t[1][1] ^ t[2][2] ^ t[3][3] ^
    t[1][0] ^ t[2][1] ^ t[3][2] ^ t[0][3] ^
    t[2][0] ^ t[3][1] ^ t[0][2] ^ t[1][3] ^
    t[3][0] ^ t[0][1] ^ t[1][2] ^ t[2][3]
  );
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
    let timeStamp = parseInt(request.headers['content-time']);

    response.write(JSON.stringify({
      isMessageSigned: crypto.timingSafeEqual(signMessage(data), Buffer.from(signed, 'base64')),
      isNonceVerified: secureNonce(nonce) === calcualtedNonce,
      isGoodTimeStamp: Date.now() > timeStamp
    }));
    response.end();

  });

}).listen(8080);