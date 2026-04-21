const amqp = require("amqplib");
require("dotenv").config();
const telegramService = require('../services/telegram.service');

class RabbitMQHandler {
  async connect(retries = 5, delay = 3000) {
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
        channel.consume(queue, async (msg) => {
          if (msg !== null) {
            try {
              const payload = JSON.parse(msg.content.toString());
              console.log("[RabbitMQ] Mensagem processada da fila.");

              // Repassa para o serviço de notificação
              await telegramService.sendNotification(payload);

              // Confirma a leitura para retirar da fila definitivamente
              channel.ack(msg);
            } catch (error) {
              console.error("Erro no processamento da notificação:", error);
              // Em caso de erro grave (ex: payload mal formado), tira da fila para não travar
              channel.ack(msg);
            }
          }
        });

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
}

module.exports = new RabbitMQHandler();
