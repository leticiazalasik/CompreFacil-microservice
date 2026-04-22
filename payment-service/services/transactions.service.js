const db = require("../configs/database.config");
const rbt = require("../configs/rabbitmq.config");

class TransactionService {
  async salvaTransacao(usuario, valor) {
    const pool = await db.getPool();
    try {
      const result = await pool.query(
        `INSERT INTO transacoes (usuario, valor, status) VALUES ($1, $2, 'pendente') RETURNING *`,
        [usuario, valor],
      );
      const transacao = result.rows[0];
      return transacao;
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
    rbt.enviaMensagem(mensagem);
  }

  notificarPagamentoConfirmado(transacao) {
    const mensagem = JSON.stringify({
      tipo: "PAGAMENTO_CONFIRMADO",
      transacaoId: transacao.id,
      usuario: transacao.usuario,
      valor: transacao.valor,
    });

    rbt.enviaMensagem(mensagem);
  }

  async confirmaTransacao(id) {
    const pool = await db.getPool();

    const result = await pool.query(
      `UPDATE transacoes
     SET status = 'sucesso'
     WHERE id = $1
     RETURNING *`,
      [id],
    );

    return result.rows[0];
  }
}

module.exports = new TransactionService();
