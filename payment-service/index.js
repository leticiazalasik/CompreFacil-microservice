const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const transactionRoute = require('./routes/transactions.routes');
const rabbitmqConfig = require("./configs/rabbitmq.config");
const databaseConfig = require("./configs/database.config");

//Roteia a requisição para o arquivo de rotas
app.use('/',transactionRoute);


// Inicia tudo
app.listen(port, async () => {
  console.log(`Payment Service rodando na porta ${port}`);
  await databaseConfig.setupDatabase();
  await rabbitmqConfig.connect();
});
