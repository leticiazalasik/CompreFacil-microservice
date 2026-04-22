const express = require("express");
const rabbitmqConfig = require("./configs/rabbitmq.config");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("Sistema de Notificação em Funcionamento!");
});



app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  rabbitmqConfig.connect()
});
