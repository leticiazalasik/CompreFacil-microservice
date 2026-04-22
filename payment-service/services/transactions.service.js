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

  async confirmarTransacao(transacao){
    const pool = await db.getPool();
    try{
      const result = await pool.query(`update transacoes set status = 'sucesso' where id = $1 returning *`,
        [transacao.id]
      )
      const novaTransacao = result.rows[0];
      return novaTransacao;
    }catch(e){
      throw e;
    }
  }

  notificarTransacao(transacao,tipo) {
    const mensagem = JSON.stringify({
      transacaoId: transacao.id,
      usuario: transacao.usuario,
      valor: transacao.valor,
      status:transacao.status
    });
    rbt.enviaMensagem(mensagem);
  }
}

module.exports = new TransactionService();
