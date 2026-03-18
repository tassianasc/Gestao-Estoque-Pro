# 📦 Gestão de Estoque Pro

O **Gestão de Estoque Pro** é uma API robusta para controle de estoque, desenvolvida com Node.js e PostgreSQL, totalmente conteinerizada com Docker. O sistema permite o gerenciamento de produtos, usuários, movimentações de entrada/saída e alertas de estoque baixo.

---
## 🛠️ Tecnologias Utilizadas
- Backend: Node.js (Fastify)
- Banco de Dados: PostgreSQL 15
- Infraestrutura: Docker & Docker Compose
- Documentação: Swagger UI
- Segurança: JWT (JSON Web Tokens)
---
## 🐳 Como Executar com Docker
Para facilitar sua vida, este projeto usa **Docker**. Isso significa que você não precisa instalar o Banco de Dados (PostgreSQL) ou o Node.js manualmente na sua máquina.

1. **Docker Desktop:** (Certifique-se de que ele esteja baixado e aberto antes de começar).
2. **Git:** Para clonar o código.
3. **VS Code:** Para visualizar o código.
---
## 🚀 Passo a Passo

### 1. Clone o projeto
Abra o terminal e digite:
```
git clone [https://github.com/tassianasc/Gestao-Estoque-Pro.git](https://github.com/tassianasc/Gestao-Estoque-Pro.git)
```
```
cd Gestao-Estoque-Pro
```
### 2. Configure suas credenciais
O projeto precisa de algumas "senhas" para funcionar.

Crie um arquivo chamado `.env` na raiz do projeto.

Copie o conteúdo do arquivo `.env.example` e cole dentro do seu novo `.env`.

Preencha os valores (ex: `DB_PASS=suasenha`).

### 3. Suba o sistema com Docker
No terminal da raiz do projeto, execute:
```
docker-compose up -d --build
```
O comando acima constrói a imagem da API, baixa o banco de dados e liga ambos em segundo plano.

### 4. Onde vejo o sistema funcionando?
Com o Docker rodando, o servidor já está ativo!

* API / Documentação (Swagger): Acesse http://localhost:3000/documentacao

* Lá você pode testar as rotas de login e cadastro direto pelo navegador.
---
### 💡 Dicas de Operação (Cheat Sheet)

Aqui estão os comandos essenciais para gerenciar o ambiente de desenvolvimento:

🛑 **Parar o Sistema**
Para desligar todos os contêineres e liberar os recursos do computador:
```
docker-compose down
```
---
🔄 **Reiniciar apenas a API**
Se você fez alterações no código e quer garantir que elas foram aplicadas:
```
docker-compose restart app
```
---
📜 **Ver Logs em Tempo Real**
Para "ouvir" o que o servidor está processando (erros, conexões, logs de acesso):
```
docker logs -f estoque_api
```
(Pressione Ctrl + C para sair da visualização dos logs sem desligar o servidor).

---
### 📊 Visualizando os Dados (DBeaver)
Para ver as tabelas e movimentações como um profissional de dados:

1. Conecte seu **DBeaver** ao `localhost:5432`.

2. Use o usuário e senha que você definiu no seu `.env`.
---
### 🏗️ Arquitetura MVC
Este projeto segue o padrão **Model-View-Controller**, o que o torna organizado e fácil de manter:

- Models: Onde definimos como os dados são salvos no Postgres.

- Controllers: Onde fica a "lógica" (ex: não vender produto sem estoque).

- Routes: Onde definimos os endereços da nossa API.
---
## 📸 Galeria do Sistema

| Documentação Swagger | Teste de Endpoints |
|:---:|:---:|
| ![Swagger 1](./assets/api-docs-swagger.png) | ![Swagger 2](./assets/api-docs-swagger_2.png) |

### 📊 Estrutura do Banco de Dados
![Visualização no DBeaver](./assets/database-diagram.png)
