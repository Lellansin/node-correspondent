const fs = require('fs');
const net = require('net');
const path = require('path');

const client = net.createConnection({ port: 3000 }, () => {
  //'connect' listener
  console.log('connected to server!');
  let fileName = './tmp';
  client.once('data', (name) => {
    fileName = './' + path.basename(name.toString());
	client.pipe(fs.createWriteStream(fileName));
	throw new Error();
  });
  // setTimeout(() => {}, 2000);
});

client.on('end', () => {
  console.log('receiver over. (disconnected)');
});
