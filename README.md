# CompreFacil-microservice

## Inicialização do Projeto

Instale as dependências nos dois serviços:

- `payment-service`
- `notification-service`

Execute os comandos em cada pasta:

```bash
npm init -y
npm install express amqplib pg dotenv
```

## Rodar os Serviços

Rodar os serviços de pagamento e notificação:

```bash
node index.js
```

## Teste da API de Transação

```bash
curl -X POST http://localhost:3001/transacao \
-H "Content-Type: application/json" \
-d "{\"usuario\": \"joao@email.com\", \"valor\": 150.00}"
```

## RabbitMQ

Para validar as mensagens na fila, acesse:

http://localhost:15672/
