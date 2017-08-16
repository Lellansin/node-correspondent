'use strcit';

const net = require('net');
const log4js = require('log4js');
const receiver = new Map();

const args = process.argv.slice(2);
const PORT_RECV = args[0] || 3000;
const PORT_SEND = args[1] || 3001;
const logger = log4js.getLogger();
logger.level = 'debug';

let ID = 0;

const recvServer = net.createServer((sock) => {
  let id = ID++;
  logger.debug(id, 'receiver come in');
  sock.on('end', () => {
    receiver.delete(id);
    logger.debug(id, 'receiver client disconnected');
  });
  receiver.set(id, sock);
}).on('error', (err) => {
  logger.error(err);
}).listen(PORT_RECV, () => {
  logger.info(`recvServer bound on ${PORT_RECV}`);
});

const pushServer = net.createServer((sender) => {
  logger.debug('sender come in');
  sender.on('end', () => {
    logger.debug('send client disconnected');
  });
  for (let id of receiver.keys()) {
    let recv = receiver.get(id);
    logger.debug('sender ready to send');
    sender
      .pipe(recv)
      .on('error', (err) => {
        logger.error(err);
        sender.end();
        recv.end();
        receiver.delete(id);
      });
    break;
    // TODO support publish more recv
  }
}).on('error', (err) => {
  logger.error(err);
}).listen(PORT_SEND, () => {
  logger.info(`pushServer bound on ${PORT_SEND}`);
});
