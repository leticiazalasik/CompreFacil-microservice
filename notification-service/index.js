const express = require("express");
const amqp = require("amqplib");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("Sistema de Notificação em Funcionamento!");
});

// Função para conectar ao RabbitMQ
async function connect(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      const queue = "notificacoes";

      await channel.assertQueue(queue);

      console.log(
        "Conectado ao RabbitMQ! Esperando por mensagens na fila:",
        queue,
      );
      channel.consume(
        queue,
        (msg) => {
          console.log("Recebido:", msg.content.toString());
        },
        { noAck: true },
      );

      return;
    } catch (error) {
      console.log(`Tentativa ${i + 1}/${retries} falhou: ${error.message}`);
      if (i < retries - 1) {
        console.log(`Tentando novamente em ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error(
          "Não foi possível conectar ao RabbitMQ após várias tentativas.",
        );
      }
    }
  }
}

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  connect();
});
