const express = require('express');
require('express-async-errors');
const amqp = require('amqplib');
const port = process.env.PORT || 3000;
const queueName = 'Hello';

let channel;

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();

  await channel.assertQueue(queueName);
}

connect().catch(error => {
  console.error('Unable to connect to the RabbitMQ:', error);
  process.exit(1);
});

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 'message': 'ok' });
});

app.get('/health', (req, res) => {
  res.status(200).send('Ok');
});

const msg = 'Hello World!';
app.get('/send', async (req, res) => {
  channel.sendToQueue(
    queueName,
    Buffer.from(msg)
  );

  console.log(" [x] Sent %s", msg);

  await channel.consume(queueName, data => {
    console.log(Buffer.from(data.content).toString());
  });

  res.status(202).json({ "status": "message sent" });
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', connection => {
  connections.push(connection);
  connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}
