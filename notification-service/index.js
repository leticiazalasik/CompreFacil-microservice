const express = require("express");
const rabbitmqConfig = require("./configs/rabbitmq.config");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("Sistema de Notificação em Funcionamento!");
});

async function iniciarServidor() {
  try {
    await rabbitmqConfig.connect();
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar Notification Service:", error);
  }
}

iniciarServidor();
