# E Corp Node.js demonstration applications

## How To run this application locally

* Runs RabbitMQ in a container and check cluster status

```bash
docker run --name rabbitmq --rm --detach -p 5672:5672 rabbitmq
docker exec rabbitmq rabbitmq-diagnostics cluster_status
```

* Makes sure RabbitMQ is running ok

```bash
./samples/send.js
docker exec rabbitmq rabbitmqctl list_queues
./samples/receive.js
```

* Installs dependencies (NPM packages)

```bash
npm install --dev
```

* Runs the application

```bash
npm start
```

* Runs the application in a container

```bash
docker build . -t ecorp-nodejs-demo
docker run --rm -p 8080:3000 --name ecorp-nodejs-demo ecorp-nodejs-demo
```
