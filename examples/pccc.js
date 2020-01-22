const { TCP, CIP, PCCC } = require('node-drivers');

const tcpLayer = new TCP({ host: '1.2.3.4', port: 44818 });
const cipLayer = new CIP(tcpLayer);
const plc5 = new PCCC(cipLayer);

plc5.typedRead('N10:47', function(err, value) {
  if (err) {
    console.log(err);
  } else {
    console.log(value);
  }

  tcpLayer.close(function() {
    console.log('closed');
  });
});