# 1. Escolhe a imagem oficial do Node.js
FROM node:18

# 2. Cria a pasta onde o código vai morar dentro do "computador" do Docker
WORKDIR /usr/src/app

# 3. Copia os arquivos de dependências primeiro (otimiza a velocidade)
COPY package*.json ./

# 4. Roda o comando para instalar as bibliotecas (node_modules) dentro do Docker
RUN npm install

# 5. Copia todo o resto do seu código da pasta backend para dentro do Docker
COPY . .

# 6. Avisa que o servidor vai rodar na porta 3000
EXPOSE 3000

# 7. O comando mágico rodando no o Docker
CMD ["node", "server.js"]