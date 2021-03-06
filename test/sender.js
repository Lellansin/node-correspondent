const fs = require('fs');
const net = require('net');
const path = require('path');

let args = process.argv.slice(2);
let [str, file] = args;
let [host, port] = str.split(':');
let addr = { port: 3001 };

if (host) addr.host = host;
if (port) addr.port = port;

let filename = require.resolve(path.join(process.cwd(), file));
let client = net.createConnection(addr, () => {
  console.log('server connected.');
  client.write(filename, () => {
    console.log('prepare to send [%s].', filename);
    let buf = fs.readFileSync(filename);
    client.write(buf, () => {
      client.end();
      console.log('sent over.')
    });
  })
});

client.on('end', () => {
  console.log('disconnected');
});

client.on('error', (error) => {
  console.log('send error', error);
});
