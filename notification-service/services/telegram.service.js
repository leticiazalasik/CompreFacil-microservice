// services/telegram.service.js

class TelegramService {
  constructor() {
    this.token = process.env.TELEGRAM_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    // Validação defensiva (Fail Fast)
    if (!this.token || !this.chatId) {
      console.warn("[Aviso] Credenciais do Telegram não encontradas no .env");
    }
  }

  async sendNotification(transactionData) {
    if (!this.token || !this.chatId) return;

    let titulo = "Nova Transação Recebida!";
    let status = "Pendente";

    if (transactionData.tipo === "PAGAMENTO_CONFIRMADO") {
      titulo = "Pagamento Confirmado!";
      status = "Sucesso";
    }

    // Formatação amigável da mensagem
    const text = `
 <b>${titulo}</b>
<b>ID:</b> #${transactionData.transacaoId || "N/A"}
<b>Cliente:</b> ${transactionData.usuario || "N/A"}
<b>Valor:</b> R$ ${transactionData.valor || "0.00"}
<b>Status:</b> ${status}
        `;

    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: "HTML", // Permite o uso das tags <b>
        }),
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}: ${response.statusText}`);
      }

      console.log(`[Telegram] Notificação enviada para o chat ${this.chatId}`);
    } catch (error) {
      console.error(
        `[Telegram Erro] Falha ao enviar notificação: ${error.message}`,
      );
    }
  }
}

module.exports = new TelegramService();
