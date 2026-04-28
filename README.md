# CompreFácil - Sistema de Microsserviços Distribuídos

Este projeto consiste numa arquitetura de microsserviços para processamento de pagamentos e notificações, desenvolvida como parte da disciplina de Desenvolvimento de Sistemas Móveis e Distribuídos no SENAI. O foco principal é demonstrar o desacoplamento de serviços, escalabilidade e comunicação assíncrona.

## 👥 Equipa de Desenvolvimento
* **Sávio Eduardo Zoboli**
* **Ana Lígia**
* **Letícia Zalasik**

## 🏗️ Arquitetura do Sistema
O ecossistema é composto por dois serviços independentes que comunicam de forma assíncrona:

1.  **Payment Service**: Responsável por receber solicitações de transação via API REST, persistir os dados na base de dados **PostgreSQL** e publicar eventos de notificação no **RabbitMQ**.
2.  **Notification Service**: Atua como consumidor do RabbitMQ. Processa as mensagens da fila e despacha notificações em tempo real para o utilizador através da **API do Telegram**.

## 🛠️ Tecnologias Utilizadas
* **Runtime**: Node.js
* **Mensageria**: RabbitMQ (Protocolo AMQP)
* **Base de Dados**: PostgreSQL
* **Orquestração**: Docker & Docker-compose
* **Integrações**: Telegram Bot API

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Docker e Docker-compose instalados.
* Um bot no Telegram (via BotFather) e o respetivo `Token` e `Chat ID`.

### Instruções
1. Clone o repositório para a sua máquina local.
2. Configure as variáveis de ambiente nos ficheiros `.env` dentro de cada serviço, ou diretamente no seu `docker-compose.yml`.
3. Na raiz do projeto, execute o comando para construir e inicializar todos os contentores:

```
docker-compose up --build
```

Este comando iniciará a base de dados, o servidor do RabbitMQ e ambas as APIs simultaneamente.

## 🧪 Como Testar

Para validar o fluxo completo (da receção do pagamento até à notificação no telemóvel), utilize o curl abaixo:

```
curl -X POST http://localhost:3000/transacao \
-H "Content-Type: application/json" \
-d '{"usuario": "Sávio", "valor": 150.00}'
```

### O que observar:
1.  **Logs**: O `payment-service` confirmará a receção e o envio para a fila.
2.  **RabbitMQ**: A mensagem passará pela fila `notificacoes`.
3.  **Telegram**: Receberá uma mensagem instantânea do bot com os detalhes da transação.

## 🧩 Princípios de Desenvolvimento
O projeto foi refatorado para seguir padrões rigorosos de engenharia de software:
* **SRP (Single Responsibility Principle)**: Cada classe e serviço possui uma única razão para mudar.
* **Padrão Singleton**: Utilizado na gestão de ligações com o RabbitMQ para evitar múltiplas instâncias desnecessárias.
* **Comunicação Assíncrona**: Garante que o serviço de pagamento não fique bloqueado a aguardar o envio de notificações de terceiros.
