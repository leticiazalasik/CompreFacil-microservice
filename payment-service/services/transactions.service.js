const db = require("../configs/database.config");
const ns = require("./notification.service");

class TransactionService {
  async salvaTransacao(usuario, valor) {
    const pool = await db.getPool();
    try {
      const result = await pool.query(
        `INSERT INTO transacoes (usuario, valor, status) VALUES ($1, $2, 'pendente') RETURNING *`,
        [usuario, valor],
      );
      const transacao = result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  notificarTransacao(transacao) {
    const mensagem = JSON.stringify({
      tipo: "SOLICITACAO_RECEBIDA",
      transacaoId: transacao.id,
      usuario: transacao.usuario,
      valor: transacao.valor,
    });
    ns.publicaMensagem(mensagem);
  }
}

module.exports = new TransactionService();
