const ts = require("../services/transactions.service");

class TransactionController {
  async processaTransacao(req, res) {
    const { usuario, valor } = req.body;

    if (!usuario || !valor) {
      return res.status(400).json({ erro: "usuario e valor são obrigatórios" });
    }

    try {
      //Armazena a transação com status pendente
      let transacao = await ts.salvaTransacao()
      console.log("Transação salva:", transacao);

      //Publica mensagem na fila para o serviço de notificação
      ts.notificarTransacao(transacao);

      res.status(201).json({
        mensagem: "Transação recebida com status pendente",
        transacao,
      });
    } catch (err) {
      console.error("Erro ao processar transação:", err);
      res.status(500).json({ erro: "Erro interno ao processar transação" });
    }
  }
}

module.exports = new TransactionController();
