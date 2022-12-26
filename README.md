# E Corp Node.js demonstration applications

## Local development

* Runs RabbitMQ in a container and check cluster status

```bash
docker run --name rabbitmq --rm --detach -p 5672:5672 -p 15672:15672 rabbitmq
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

* Runs the application (test it with `curl http://localhost:3000/send`)

```bash
npm start
```

* Runs the application in a container (test it with `curl http://localhost:8080/send`)

```bash
docker build . -t ecorp-nodejs-demo
docker network create demo
docker network connect demo rabbitmq
docker run --name ecorp-nodejs-demo --rm -p 8080:3000 --net=demo -e "RABBITMQ_URL=amqp://rabbitmq:5672" ecorp-nodejs-demo
```

* Cleans up

```bash
docker ps stop rabbitmq
docker network delete demo
```

## References

* [RabbitMQ Hello World tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
