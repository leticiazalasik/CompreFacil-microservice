const express = require("express");
const amqp = require("amqplib");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Conexão com o Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Cria a tabela de transações se não existir
async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transacoes (
      id SERIAL PRIMARY KEY,
      usuario VARCHAR(100) NOT NULL,
      valor NUMERIC(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pendente',
      criado_em TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("Tabela de transações pronta!");
}

// Conecta ao RabbitMQ com retry
let channel;
async function connectRabbitMQ(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("notificacoes");
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

// Rota para receber solicitação de transação
app.post("/transacao", async (req, res) => {
  const { usuario, valor } = req.body;

  if (!usuario || !valor) {
    return res.status(400).json({ erro: "usuario e valor são obrigatórios" });
  }

  try {
    //Armazena a transação com status pendente
    const result = await pool.query(
      `INSERT INTO transacoes (usuario, valor, status) VALUES ($1, $2, 'pendente') RETURNING *`,
      [usuario, valor],
    );
    const transacao = result.rows[0];
    console.log("Transação salva:", transacao);

    //Publica mensagem na fila para o serviço de notificação
    const mensagem = JSON.stringify({
      tipo: "SOLICITACAO_RECEBIDA",
      transacaoId: transacao.id,
      usuario: transacao.usuario,
      valor: transacao.valor,
    });
    channel.sendToQueue("notificacoes", Buffer.from(mensagem));
    console.log("Mensagem publicada na fila:", mensagem);

    res.status(201).json({
      mensagem: "Transação recebida com status pendente",
      transacao,
    });
  } catch (err) {
    console.error("Erro ao processar transação:", err);
    res.status(500).json({ erro: "Erro interno ao processar transação" });
  }
});

// Inicia tudo
app.listen(port, async () => {
  console.log(`Payment Service rodando na porta ${port}`);
  await setupDatabase();
  await connectRabbitMQ();
});
