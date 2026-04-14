# CompreFacil-microservice

Inicia o projeto e instala as dependências:
Na pasta payment-service e na pasta notification-service executar os comandos:  
npm init -y
npm install express amqplib pg dotenv

Rodar o serviço de notificação e de pagamento nas respectivas pastas 
node index.js

Exemplo de comando no terminal para teste de rota de transação (pasta de payment)
curl -X POST http://localhost:3001/transacao -H "Content-Type: application/json" -d "{\"usuario\": \"joao@email.com\", \"valor\": 150.00}"

Validações de entrada e saída da fila do rabbitMQ
http://localhost:15672/