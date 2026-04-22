# CompreFacil-microservice

## Inicialização do Projeto
Na pasta raíz inserir noa rquivo .env as variáveis de ambiente do telegram.

Em seguida pode subir o projeto com o seguinte comando: 

```bash
docker compose up --build
```

## Teste da API de Transação

```bash
curl -X POST http://localhost:3001/payment \
-H "Content-Type: application/json" \
-d "{\"usuario\": \"joao@email.com\", \"valor\": 150.00}"
```

## RabbitMQ

Para validar as mensagens na fila, acesse: http://localhost:15672/
