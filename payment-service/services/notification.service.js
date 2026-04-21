class NotificationService{
    publicaMensagem(mensagem){
        channel.sendToQueue("notificacoes", Buffer.from(mensagem));
        console.log("Mensagem publicada na fila:", mensagem);
    }
}

module.exports = new NotificationService();