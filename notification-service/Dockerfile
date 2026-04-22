# Usa uma imagem oficial do Node.js mais leve (Alpine)
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Comando para iniciar o serviço
CMD ["node", "index.js"]