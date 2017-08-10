const fs = require('fs');
const net = require('net');
const path = require('path');

let args = process.argv.slice(2);
let [host, port] = args;
let addr = { port: 3000 };

if (host) addr.host = host;
if (port) addr.port = port;

const client = net.createConnection(addr, () => {
  console.log('server connected.');
  let fileName = './tmp';
  client.once('data', (name) => {
    fileName = './' + path.basename(name.toString());
    console.log('receiving file [%s]', fileName);
    client.pipe(fs.createWriteStream(fileName))
      .on('end', () => {
      	console.log('File [%s] written.', fileName);
      });
  });
});

client.on('end', () => {
  console.log('receiver over. (disconnected)');
});
