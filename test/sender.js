const fs = require('fs');
const net = require('net');

let client = net.createConnection({ port: 3001 }, () => {
  //'connect' listener
  console.log('connected to server!');
  // fs.createReadStream('./IMG_2270.JPG').pipe(client);
  let filename = './IMG_2270.JPG';
  client.write(filename, () => {
    let buf = fs.readFileSync(filename);
    client.write(buf, () => {
      client.end();
    });
  })
});

client.on('end', () => {
  console.log('disconnected');
});
