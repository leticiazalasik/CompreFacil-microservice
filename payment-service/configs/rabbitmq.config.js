
const amqp = require("amqplib");

class RabbitMQHandler {

  channel
  connection

  constructor(){
    this.channel = null
    this.connection = null
  }
  // Conecta ao RabbitMQ com retry
  async connect(retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
      try {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue("notificacoes");
        console.log("Conectado ao RabbitMQ!");
        return;
      } catch (err) {
        console.log(`Tentativa ${i + 1}/${retries} falhou: ${err.message}`);
        if (i < retries - 1) {
          console.log(`Tentando novamente em ${delay / 1000}s...`);
          await new Promise((res) => setTimeout(res, delay));
        } else {
          console.error("Não foi possível conectar ao RabbitMQ.");
        }
      }
    }
  }

  enviaMensagem(mensagem){
    this.channel.sendToQueue("notificacoes", Buffer.from(mensagem));
  }
}

module.exports =  new RabbitMQHandler();
